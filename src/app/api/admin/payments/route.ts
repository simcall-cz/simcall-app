import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

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

    // 3. Assign the role and subscription to the user
    if (payment.user_id) {
      const planRole = payment.plan === "team" ? "team_manager" : payment.plan;
      const tierConfig = TIER_CONFIG[payment.plan]?.[payment.tier - 1];

      // Update profile role
      await db
        .from("profiles")
        .update({ role: planRole, updated_at: now })
        .eq("id", payment.user_id);

      if (tierConfig) {
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(1);
        endOfMonth.setHours(0, 0, 0, 0);

        // Check for existing subscription
        const { data: existingSub } = await db
          .from("subscriptions")
          .select("id")
          .eq("user_id", payment.user_id)
          .eq("status", "active")
          .limit(1)
          .single();

        if (existingSub) {
          await db
            .from("subscriptions")
            .update({
              plan: payment.plan,
              tier: payment.tier,
              calls_limit: tierConfig.calls,
              agents_limit: tierConfig.agents,
              calls_used: 0,
              updated_at: now,
            })
            .eq("id", existingSub.id);
        } else {
          await db
            .from("subscriptions")
            .insert({
              user_id: payment.user_id,
              plan: payment.plan,
              tier: payment.tier,
              status: "active",
              calls_used: 0,
              calls_limit: tierConfig.calls,
              agents_limit: tierConfig.agents,
              customer_name: payment.user_name,
              customer_email: payment.user_email,
              current_period_start: now,
              current_period_end: endOfMonth.toISOString(),
              created_at: now,
              updated_at: now,
            });
        }
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
