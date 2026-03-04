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
        // Count the team member's own calls this month as their usage
        const callsUsed = await countCallsThisMonth(supabase, user.id);
        return NextResponse.json({
          ...formatSub(managerResult.subscription),
          callsUsed,
          isTeamMember: true,
          managerPlan: true,
          managerEmail: managerResult.managerEmail || null,
        });
      }
    }

    // 4. Role-based defaults (admin-assigned, no Stripe subscription)
    const ROLE_DEFAULTS: Record<string, { plan: string; callsLimit: number; agentsLimit: number }> = {
      solo: { plan: "solo", callsLimit: 50, agentsLimit: 5 },
      team: { plan: "team", callsLimit: 250, agentsLimit: 25 },
      team_manager: { plan: "team", callsLimit: 250, agentsLimit: 25 },
    };

    const defaults = ROLE_DEFAULTS[role];
    if (defaults) {
      const callsUsed = await countCallsThisMonth(supabase, user.id);
      return NextResponse.json({
        plan: defaults.plan,
        tier: 1,
        callsUsed,
        callsLimit: defaults.callsLimit,
        agentsLimit: defaults.agentsLimit,
        status: "active",
        isTeamMember: role === "team",
      });
    }

    // 5. Free user
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSub(sub: any) {
  return {
    plan: sub.plan,
    tier: sub.tier,
    callsUsed: sub.calls_used,
    callsLimit: sub.calls_limit,
    agentsLimit: sub.agents_limit,
    status: sub.status,
    currentPeriodEnd: sub.current_period_end,
    stripeCustomerId: sub.stripe_customer_id,
  };
}

async function countCallsThisMonth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("calls")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("date", startOfMonth.toISOString());

  return count || 0;
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
