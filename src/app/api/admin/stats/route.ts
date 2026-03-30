import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";
import { PLAN_PRICES } from "@/lib/stripe";

// GET /api/admin/stats - Fetch platform statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Core queries that should always work
    const [usersResult, callsResult, callsTodayResult, recentUsersResult, allProfilesResult, callsThisWeekResult, callsThisMonthResult] = await Promise.all([
      db.from("profiles").select("*", { count: "exact", head: true }),
      db.from("calls").select("*", { count: "exact", head: true }),
      db.from("calls").select("*", { count: "exact", head: true }).gte("date", todayStr),
      db.from("profiles").select("id, email, full_name, role, created_at").order("created_at", { ascending: false }).limit(10),
      db.from("profiles").select("role, created_at"),
      db.from("calls").select("*", { count: "exact", head: true }).gte("date", weekAgo),
      db.from("calls").select("*", { count: "exact", head: true }).gte("date", monthAgo),
    ]);

    // Calculate users by role
    const usersByRole: Record<string, number> = {};
    let newUsersThisWeek = 0;
    let newUsersThisMonth = 0;
    if (allProfilesResult.data) {
      for (const p of allProfilesResult.data) {
        usersByRole[p.role] = (usersByRole[p.role] || 0) + 1;
        if (new Date(p.created_at) >= new Date(weekAgo)) newUsersThisWeek++;
        if (new Date(p.created_at) >= new Date(monthAgo)) newUsersThisMonth++;
      }
    }

    // Calculate total minutes used across all subscriptions
    let totalMinutesUsed = 0;
    try {
      const { data: allSubs } = await db
        .from("subscriptions")
        .select("seconds_used")
        .eq("status", "active");
      if (allSubs) {
        totalMinutesUsed = Math.floor(allSubs.reduce((sum, s) => sum + (s.seconds_used || 0), 0) / 60);
      }
    } catch {
      // subscriptions table may not exist
    }

    // Count agents and scenarios
    let totalAgents = 0;
    let totalScenarios = 0;
    try {
      const [agentsResult, scenariosResult] = await Promise.all([
        db.from("agents").select("*", { count: "exact", head: true }),
        db.from("scenarios").select("*", { count: "exact", head: true }),
      ]);
      totalAgents = agentsResult.count || 0;
      totalScenarios = scenariosResult.count || 0;
    } catch {
      // tables may not exist
    }

    // Subscription queries — table may not exist yet
    let activeSubsCount = 0;
    let mrr = 0;
    const revenueByPlan: Record<string, { count: number; revenue: number }> = {};

    try {
      const { count } = await db
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      activeSubsCount = count || 0;

      const { data: allSubs } = await db
        .from("subscriptions")
        .select("plan, tier")
        .eq("status", "active");

      if (allSubs) {
        for (const sub of allSubs) {
          const planPrices = PLAN_PRICES[sub.plan];
          const tierPrice = planPrices?.[sub.tier];
          const price = tierPrice?.price || 0;
          mrr += price;
          if (!revenueByPlan[sub.plan]) {
            revenueByPlan[sub.plan] = { count: 0, revenue: 0 };
          }
          revenueByPlan[sub.plan].count += 1;
          revenueByPlan[sub.plan].revenue += price;
        }
      }
    } catch {
      // subscriptions table may not exist
    }

    return NextResponse.json({
      totalUsers: usersResult.count || 0,
      totalCalls: callsResult.count || 0,
      activeSubscriptions: activeSubsCount,
      mrr,
      recentRegistrations: recentUsersResult.data || [],
      callsToday: callsTodayResult.count || 0,
      callsThisWeek: callsThisWeekResult.count || 0,
      callsThisMonth: callsThisMonthResult.count || 0,
      revenueByPlan,
      usersByRole,
      newUsersThisWeek,
      newUsersThisMonth,
      totalMinutesUsed,
      totalAgents,
      totalScenarios,
    });
  } catch (err) {
    console.error("GET /api/admin/stats error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
