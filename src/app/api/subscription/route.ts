import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

// Default limits per role (when no Stripe subscription exists)
const ROLE_DEFAULTS: Record<string, { plan: string; callsLimit: number; agentsLimit: number }> = {
  solo: { plan: "solo", callsLimit: 50, agentsLimit: 5 },
  team: { plan: "team", callsLimit: 250, agentsLimit: 25 },
  team_manager: { plan: "team", callsLimit: 250, agentsLimit: 25 },
};

// GET /api/subscription - Get current user's subscription info
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // Try to fetch active subscription from Stripe
    let subscription = null;
    try {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      subscription = data;
    } catch {
      // subscriptions table may not exist yet
    }

    if (subscription) {
      return NextResponse.json({
        plan: subscription.plan,
        tier: subscription.tier,
        callsUsed: subscription.calls_used,
        callsLimit: subscription.calls_limit,
        agentsLimit: subscription.agents_limit,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        stripeCustomerId: subscription.stripe_customer_id,
      });
    }

    // No Stripe subscription — check profile role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "free";
    const defaults = ROLE_DEFAULTS[role];

    if (defaults) {
      // Paid role set by admin — count calls this month as usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("calls")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString());

      return NextResponse.json({
        plan: defaults.plan,
        tier: 1,
        callsUsed: count || 0,
        callsLimit: defaults.callsLimit,
        agentsLimit: defaults.agentsLimit,
        status: "active",
      });
    }

    // Free user — count total calls as usage
    const { count } = await supabase
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      plan: "demo",
      tier: 0,
      callsUsed: count || 0,
      callsLimit: 3,
      agentsLimit: 1,
      status: "active",
    });
  } catch (err) {
    console.error("GET /api/subscription error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
