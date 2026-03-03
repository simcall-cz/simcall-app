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

    // Run all queries in parallel for performance
    const [
      usersResult,
      callsResult,
      activeSubsResult,
      allSubsResult,
      recentUsersResult,
      callsTodayResult,
    ] = await Promise.all([
      // Total users
      db.from("profiles").select("*", { count: "exact", head: true }),

      // Total calls
      db.from("calls").select("*", { count: "exact", head: true }),

      // Active subscriptions
      db
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      // All active subscriptions with plan/tier for MRR and revenue-by-plan
      db
        .from("subscriptions")
        .select("plan, tier")
        .eq("status", "active"),

      // Recent registrations (last 10)
      db
        .from("profiles")
        .select("id, email, full_name, plan_role, created_at")
        .order("created_at", { ascending: false })
        .limit(10),

      // Calls today
      db
        .from("calls")
        .select("*", { count: "exact", head: true })
        .gte("date", new Date().toISOString().split("T")[0]),
    ]);

    // Calculate MRR from active subscriptions
    let mrr = 0;
    const revenueByPlan: Record<string, { count: number; revenue: number }> = {};

    if (allSubsResult.data) {
      for (const sub of allSubsResult.data) {
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

    return NextResponse.json({
      totalUsers: usersResult.count || 0,
      totalCalls: callsResult.count || 0,
      activeSubscriptions: activeSubsResult.count || 0,
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
