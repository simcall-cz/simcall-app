import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";
import { getResend, getFromEmail } from "@/lib/resend";
import InvoiceActionEmail from "@/emails/InvoiceActionEmail";
import { notifyBusiness, NotifyColors } from "@/lib/notifications";
import { getPlanPrice } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();

    // 1. Fetch pending invoice requests
    const { data: requests, error: requestsError } = await db
      .from("invoice_requests")
      .select(`
        id, user_id, current_plan, current_tier, requested_plan, requested_tier, status, created_at,
        profiles ( email, full_name )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    // 2. Fetch active invoice subscriptions
    // We get those whose billing_method is invoice and status is active
    const { data: subscriptions, error: subsError } = await db
      .from("subscriptions")
      .select(`
        id, user_id, plan, tier, status, calls_used, calls_limit, current_period_start, current_period_end, customer_name, customer_email, billing_method
      `)
      .eq("billing_method", "invoice")
      .eq("status", "active")
      .order("current_period_end", { ascending: true }); // sort by nearest expiration

    if (requestsError) console.error("Admin invoices: Failed to load requests", requestsError);
    if (subsError) console.error("Admin invoices: Failed to load subscriptions", subsError);

    // Map the Supabase joins for convenience
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedRequests = (requests || []).map((req: any) => ({
      ...req,
      customer_email: req.profiles?.email,
      customer_name: req.profiles?.full_name,
    }));

    return NextResponse.json({
      requests: formattedRequests,
      subscriptions: subscriptions || [],
    });
  } catch (err) {
    console.error("GET /api/admin/invoices error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Map plans to roles
const getPlanRole = (plan: string) => {
  return plan === "team" ? "team_manager" : plan;
};

// Define tier limits
const getTierLimits = (plan: string, tier: number) => {
  const configs: Record<string, { calls: number; agents: number }[]> = {
    solo: [
      { calls: 50, agents: 5 }, { calls: 100, agents: 10 }, { calls: 250, agents: 25 },
      { calls: 500, agents: 50 }, { calls: 1000, agents: 100 },
    ],
    team: [
      { calls: 250, agents: 25 }, { calls: 500, agents: 50 }, { calls: 1000, agents: 100 },
      { calls: 2500, agents: 250 }, { calls: 5000, agents: 500 },
    ],
  };
  
  // Find the exact calls limit based on tier matching
  const list = configs[plan] || [];
  const rule = list.find((c) => c.calls === tier) || list[0] || { calls: 50, agents: 5 };
  return rule;
};

export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { action } = body;

    // Extend subscription by 1 month
    if (action === "extend") {
      const { subscriptionId } = body;
      if (!subscriptionId) return NextResponse.json({ error: "Missing subscriptionId" }, { status: 400 });

      // Get current subscription
      const { data: sub } = await db.from("subscriptions").select("*").eq("id", subscriptionId).single();
      if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

      // Calculate new end date
      let newEnd = new Date(sub.current_period_end || new Date());
      newEnd.setDate(newEnd.getDate() + 30); // Exactly 30 days instead of jumping to the 1st incorrectly

      // Update DB
      const { error } = await db
        .from("subscriptions")
        .update({
          current_period_end: newEnd.toISOString(),
          calls_used: 0,
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);

      if (error) throw error;

      // Send email
      if (sub.customer_email) {
        try {
          const resend = getResend();
          await resend.emails.send({
            from: getFromEmail(),
            to: sub.customer_email,
            subject: "Platba přijata — Plán prodloužen ✅",
            react: InvoiceActionEmail({
              customerName: sub.customer_name || "Zákazníku",
              actionParams: {
                type: "extended",
                plan: sub.plan,
                tier: sub.tier,
                callsLimit: sub.calls_limit,
                currentPeriodEnd: newEnd.toISOString(),
              },
            }),
          });
        } catch (e) {
          console.error("Failed to send extend email:", e);
        }
      }

      // Log Payment in generic table
      try {
        const planPrice = getPlanPrice(sub.plan, sub.tier);
        if (planPrice) {
          await db.from("payments").insert({
            user_id: sub.user_id,
            customer_email: sub.customer_email || "",
            stripe_customer_id: "invoice",
            stripe_session_id: `inv_ext_${Date.now()}`,
            amount: planPrice.price,
            currency: "czk",
            status: "completed",
            metadata: {
              plan: sub.plan,
              tier: sub.tier,
              billing_method: "invoice",
              action: "extend"
            }
          });
        }
      } catch (e) {
        console.error("Failed to log payment for extend:", e);
      }

      // 🔔 Notify on Discord (Admin Action)
      await notifyBusiness({
        title: "🔄 Faktura prodloužena",
        color: NotifyColors.SUCCESS,
        fields: [
          { name: "Zákazník", value: sub.customer_email || "Neznámý", inline: true },
          { name: "Plán", value: `${sub.plan.toUpperCase()} ${sub.tier}`, inline: true },
          { name: "Do", value: newEnd.toLocaleDateString("cs-CZ"), inline: true },
        ],
        description: "Administrátor manuálně zapsal platbu a prodloužil platnost fakturačního účtu.",
      });

      return NextResponse.json({ success: true, message: "Subscription extended" });
    }

    // Resolve an invoice request
    if (action === "resolve_request") {
      const { requestId, status } = body; // 'approved' or 'rejected'
      if (!requestId || !status) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

      const { data: reqData } = await db.from("invoice_requests").select("*, profiles ( email, full_name )").eq("id", requestId).single();
      if (!reqData) return NextResponse.json({ error: "Request not found" }, { status: 404 });

      // Update request status
      await db.from("invoice_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", requestId);

      if (status === "approved") {
        // Find subscription and profile
        const limits = getTierLimits(reqData.requested_plan, reqData.requested_tier);
        const newRole = getPlanRole(reqData.requested_plan);

        // Update Subscription
        await db.from("subscriptions").update({
          plan: reqData.requested_plan,
          tier: reqData.requested_tier,
          calls_limit: limits.calls,
          agents_limit: limits.agents,
          updated_at: new Date().toISOString()
        }).eq("user_id", reqData.user_id).eq("status", "active");

        // Update Profile
        await db.from("profiles").update({
          role: newRole,
          updated_at: new Date().toISOString()
        }).eq("id", reqData.user_id);

        // Send Email
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profileInfo = reqData.profiles as any;
        if (profileInfo && profileInfo.email) {
          try {
            const resend = getResend();
            await resend.emails.send({
              from: getFromEmail(),
              to: profileInfo.email,
              subject: "Změna tarifu byla schválena ✅",
              react: InvoiceActionEmail({
                customerName: profileInfo.full_name || "Zákazníku",
                actionParams: {
                  type: "approved",
                  plan: reqData.requested_plan,
                  tier: reqData.requested_tier,
                  callsLimit: limits.calls,
                },
              }),
            });
          } catch (e) {
            console.error("Failed to send approve email:", e);
          }
        }

        // Log Payment for upgrade
        try {
          const planPrice = getPlanPrice(reqData.requested_plan, reqData.requested_tier);
          if (planPrice) {
            await db.from("payments").insert({
              user_id: reqData.user_id,
              customer_email: profileInfo?.email || "",
              stripe_customer_id: "invoice",
              stripe_session_id: `inv_upg_${Date.now()}`,
              amount: planPrice.price, // Technically they might pay a prorated difference, but it's okay to log full price for MRR
              currency: "czk",
              status: "completed",
              metadata: {
                plan: reqData.requested_plan,
                tier: reqData.requested_tier,
                billing_method: "invoice",
                action: "upgrade_approve"
              }
            });
          }
        } catch (e) {
          console.error("Failed to log payment for request approve:", e);
        }
      }

      // 🔔 Notify on Discord (Admin Action)
      const actionTitle = status === "approved" ? "✅ Žádost schválena" : "❌ Žádost zamítnuta";
      const actionColor = status === "approved" ? NotifyColors.SUCCESS : NotifyColors.ERROR;
      const customerStr = reqData.profiles?.email || "Neznámý";

      await notifyBusiness({
        title: actionTitle,
        color: actionColor,
        fields: [
          { name: "Zákazník", value: customerStr, inline: true },
          { name: "Původní", value: `${reqData.current_plan.toUpperCase()} ${reqData.current_tier}`, inline: true },
          { name: "Nový", value: `${reqData.requested_plan.toUpperCase()} ${reqData.requested_tier}`, inline: true },
        ],
        description: `Administrátor vyřešil fakturační žádost o změnu tarifu.`,
      });

      return NextResponse.json({ success: true, message: `Request ${status}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("PATCH /api/admin/invoices error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
