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

    // Core queries that should always work
    const [usersResult, callsResult, callsTodayResult, recentUsersResult] = await Promise.all([
      db.from("profiles").select("*", { count: "exact", head: true }),
      db.from("calls").select("*", { count: "exact", head: true }),
      db.from("calls").select("*", { count: "exact", head: true }).gte("date", new Date().toISOString().split("T")[0]),
      db.from("profiles").select("id, email, full_name, role, created_at").order("created_at", { ascending: false }).limit(10),
    ]);

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
      revenueByPlan,
    });
  } catch (err) {
    console.error("GET /api/admin/stats error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
