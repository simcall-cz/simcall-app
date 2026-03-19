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

    // 1. Try to fetch user's own active subscription (for solo/team_manager who bought directly)
    const { data: ownSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (ownSub) {
      return NextResponse.json(formatSub(ownSub));
    }

    // 2. Check profile role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "free";

    // 3. If user is a team member, inherit manager's subscription
    if (role === "team") {
      const managerResult = await getManagerSubscription(supabase, user.id);
      if (managerResult) {
        // Sum the team member's own seconds this month as their usage
        const totalSeconds = await sumSecondsThisMonth(supabase, user.id);
        return NextResponse.json({
          ...formatSub(managerResult.subscription),
          minutesUsed: Math.floor(totalSeconds / 60),
          isTeamMember: true,
          managerPlan: true,
          managerEmail: managerResult.managerEmail || null,
        });
      }
    }

    // 4. Role-based defaults (admin-assigned, no Stripe subscription)
    const ROLE_DEFAULTS: Record<string, { plan: string; minutesLimit: number; agentsLimit: number }> = {
      solo: { plan: "solo", minutesLimit: 100, agentsLimit: 10 },
      team: { plan: "team", minutesLimit: 500, agentsLimit: 50 },
      team_manager: { plan: "team", minutesLimit: 500, agentsLimit: 50 },
    };

    const defaults = ROLE_DEFAULTS[role];
    if (defaults) {
      const totalSeconds = await sumSecondsThisMonth(supabase, user.id);
      return NextResponse.json({
        plan: defaults.plan,
        tier: 1,
        minutesUsed: Math.floor(totalSeconds / 60),
        minutesLimit: defaults.minutesLimit,
        agentsLimit: defaults.agentsLimit,
        status: "active",
        isTeamMember: role === "team",
      });
    }

    // 5. Free user
    const { data: freeCallsData } = await supabase
      .from("calls")
      .select("duration_seconds")
      .eq("user_id", user.id)
      .eq("status", "completed");

    const totalSeconds = (freeCallsData || []).reduce(
      (sum: number, c: { duration_seconds: number }) => sum + (c.duration_seconds || 0),
      0
    );

    return NextResponse.json({
      plan: "demo",
      tier: 0,
      minutesUsed: Math.floor(totalSeconds / 60),
      minutesLimit: 10,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSub(sub: any) {
  return {
    plan: sub.plan,
    tier: sub.tier,
    minutesUsed: Math.floor((sub.seconds_used || 0) / 60),
    minutesLimit: sub.minutes_limit,
    agentsLimit: sub.agents_limit,
    status: sub.status,
    currentPeriodEnd: sub.current_period_end,
    stripeCustomerId: sub.stripe_customer_id,
    billingMethod: sub.billing_method,
    scheduledPlan: sub.scheduled_plan || null,
    scheduledTier: sub.scheduled_tier || null,
  };
}

async function sumSecondsThisMonth(supabase: any, userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from("calls")
    .select("duration_seconds")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("date", startOfMonth.toISOString());
  return (data || []).reduce((sum: number, c: { duration_seconds: number }) => sum + (c.duration_seconds || 0), 0);
}

async function getManagerSubscription(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string
): Promise<{ subscription: any; managerEmail: string | null } | null> {
  // Find the company this user belongs to
  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!membership) return null;

  // Find the manager of this company
  const { data: manager } = await supabase
    .from("company_members")
    .select("user_id")
    .eq("company_id", membership.company_id)
    .eq("role", "manager")
    .limit(1)
    .single();

  if (!manager) return null;

  // Get manager's email from profiles
  const { data: managerProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", manager.user_id)
    .single();

  // Get the manager's subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", manager.user_id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!sub) return null;

  return {
    subscription: sub,
    managerEmail: managerProfile?.email || null,
  };
}
