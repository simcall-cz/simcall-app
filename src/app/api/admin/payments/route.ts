import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";
import { getResend, getFromEmail } from "@/lib/resend";
import AccountCreatedEmail from "@/emails/AccountCreatedEmail";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import {
  notifyPaymentCompleted,
  notifyAutoAccountCreated,
} from "@/lib/notifications";

const TIER_CONFIG: Record<string, { calls: number; agents: number }[]> = {
  solo: [
    { calls: 50, agents: 5 },
    { calls: 100, agents: 10 },
    { calls: 250, agents: 25 },
    { calls: 500, agents: 50 },
    { calls: 1000, agents: 100 },
  ],
  team: [
    { calls: 250, agents: 25 },
    { calls: 500, agents: 50 },
    { calls: 1000, agents: 100 },
    { calls: 2500, agents: 250 },
    { calls: 5000, agents: 500 },
  ],
};

// GET /api/admin/payments - List all payments
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();

    try {
      const { data: payments, error } = await db
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Payments query error:", error.message);
        return NextResponse.json({ payments: [] });
      }

      return NextResponse.json({ payments: payments || [] });
    } catch {
      return NextResponse.json({ payments: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/payments error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/payments - Approve a pending invoice payment
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId is required" },
        { status: 400 }
      );
    }

    // 1. Get the payment
    const { data: payment, error: paymentError } = await db
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.status === "completed") {
      return NextResponse.json(
        { error: "Payment is already completed" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // 2. Approve the payment
    await db
      .from("payments")
      .update({ status: "completed", updated_at: now })
      .eq("id", paymentId);

    // 3. Resolve user_id: Use existing, find by email, or auto-create account
    let userId = payment.user_id;
    let accountAutoCreated = false;
    let temporaryPassword = "";

    const customerEmail = payment.user_email?.toLowerCase();
    const customerName = payment.user_name || customerEmail?.split("@")[0] || "Uživatel";

    if (!userId && customerEmail) {
      // Find by email
      const { data: profile } = await db
        .from("profiles")
        .select("id")
        .eq("email", customerEmail)
        .limit(1)
        .single();
      
      if (profile) {
        userId = profile.id;
        console.log(`[admin/payments] Found user by email: ${customerEmail} → ${userId}`);
      } else {
        // Auto-create account
        try {
          temporaryPassword = Array.from(
            { length: 12 },
            () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'[Math.floor(Math.random() * 59)]
          ).join('');

          const planRole = payment.plan === "team" ? "team_manager" : payment.plan;

          const { data: newUser, error: createError } = await db.auth.admin.createUser({
            email: customerEmail,
            password: temporaryPassword,
            email_confirm: true,
            user_metadata: {
              full_name: customerName,
              role: planRole,
            },
          });

          if (createError || !newUser?.user) {
            console.error('[admin/payments] Failed to auto-create user:', createError);
          } else {
            userId = newUser.user.id;
            accountAutoCreated = true;

            await db
              .from('profiles')
              .insert({
                id: userId,
                email: customerEmail,
                full_name: customerName,
                role: planRole,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            console.log(`[admin/payments] Auto-created account for ${customerEmail} → ${userId}`);
          }
        } catch (autoCreateErr) {
          console.error('[admin/payments] Auto-create account error:', autoCreateErr);
        }
      }
    }

    // Update payment record to correctly link the user_id if we found/created one
    if (userId && !payment.user_id) {
      await db
        .from("payments")
        .update({ user_id: userId })
        .eq("id", paymentId);
    }

    const planRole = payment.plan === "team" ? "team_manager" : payment.plan;
    const tierConfig = TIER_CONFIG[payment.plan]?.[payment.tier - 1];
    const callsLimit = tierConfig ? tierConfig.calls : 0;
    const agentsLimit = tierConfig ? tierConfig.agents : 0;

    // 4. Assign the role, subscription, and team company to the user
    if (userId) {
      // Update profile role
      await db
        .from("profiles")
        .update({ role: planRole, updated_at: now })
        .eq("id", userId);

      if (tierConfig) {
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(1);
        endOfMonth.setHours(0, 0, 0, 0);

        // Check for existing subscription
        const { data: existingSub } = await db
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "active")
          .limit(1)
          .single();

        if (existingSub) {
          await db
            .from("subscriptions")
            .update({
              plan: payment.plan,
              tier: payment.tier,
              calls_limit: callsLimit,
              agents_limit: agentsLimit,
              calls_used: 0,
              updated_at: now,
            })
            .eq("id", existingSub.id);
        } else {
          await db
            .from("subscriptions")
            .insert({
              user_id: userId,
              plan: payment.plan,
              tier: payment.tier,
              status: "active",
              calls_used: 0,
              calls_limit: callsLimit,
              agents_limit: agentsLimit,
              customer_name: payment.user_name,
              customer_email: payment.user_email,
              current_period_start: now,
              current_period_end: endOfMonth.toISOString(),
              created_at: now,
              updated_at: now,
            });
        }
      }

      // For team plans, create a company and add the owner as manager
      if (payment.plan === "team") {
        const { data: existingCompany } = await db
          .from("companies")
          .select("id")
          .eq("owner_id", userId)
          .limit(1)
          .single();

        if (!existingCompany) {
          const { data: company } = await db
            .from("companies")
            .insert({
              name: customerName ? `${customerName} – Team` : "Můj tým",
              owner_id: userId,
            })
            .select("id")
            .single();

          if (company) {
            await db.from("company_members").insert({
              company_id: company.id,
              user_id: userId,
              role: "manager",
            });
          }
        }
      }
    }

    // 5. Send Email to the customer
    if (customerEmail) {
      const resend = getResend();

      try {
        if (accountAutoCreated && temporaryPassword) {
          await resend.emails.send({
            from: getFromEmail(),
            to: [customerEmail],
            subject: "Váš účet SimCall byl vytvořen — přihlašovací údaje 🔑",
            react: AccountCreatedEmail({
              customerName,
              email: customerEmail,
              temporaryPassword,
              plan: payment.plan,
              tier: payment.tier,
              callsLimit,
            }),
          });
        } else {
          await resend.emails.send({
            from: getFromEmail(),
            to: [customerEmail],
            subject: "Potvrzení objednávky — SimCall ✅",
            react: OrderConfirmationEmail({
              customerName,
              plan: payment.plan,
              tier: payment.tier,
              callsLimit,
              customerEmail,
            }),
          });
        }
      } catch (err) {
        console.error("[email] Email sending failed in admin payments:", err);
      }
    }

    // 6. Send Discord notifications
    if (customerEmail) {
      await notifyPaymentCompleted(customerEmail, payment.plan, payment.tier, payment.amount);
      if (accountAutoCreated) {
        await notifyAutoAccountCreated(customerEmail, customerName, payment.plan, payment.tier);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/payments error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
