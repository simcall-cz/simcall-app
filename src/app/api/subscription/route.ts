import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/subscription - Get current user's subscription info
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // Try to fetch active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!subscription) {
      // Demo user — count total calls as usage
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
    }

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
  } catch (err) {
    console.error("GET /api/subscription error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
