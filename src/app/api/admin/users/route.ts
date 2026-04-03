import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/users - List all users with search, filter, pagination
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const planRole = searchParams.get("role") || "";
    function safeInt(val: string | null, fallback: number, max: number): number {
      const n = parseInt(val || String(fallback), 10);
      if (isNaN(n) || n < 0) return fallback;
      return Math.min(n, max);
    }
    const limit = safeInt(searchParams.get("limit"), 20, 200);
    const offset = safeInt(searchParams.get("offset"), 0, 100000);

    // Build query for profiles — no join (subscriptions table may not exist)
    let query = db
      .from("profiles")
      .select(
        `id, email, full_name, role, created_at`,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter (email or name)
    if (search) {
      const sanitizedSearch = search.replace(/[%_(),.*\\"`']/g, "").slice(0, 100);
      if (sanitizedSearch.length > 0) {
        query = query.or(`email.ilike.%${sanitizedSearch}%,full_name.ilike.%${sanitizedSearch}%`);
      }
    }

    // Apply role filter
    if (planRole) {
      query = query.eq("role", planRole);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("Admin users query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Try to fetch subscriptions separately (table may not exist)
    let subsMap: Record<string, unknown> = {};
    try {
      const { data: subs } = await db
        .from("subscriptions")
        .select("user_id, id, plan, tier, status, seconds_used, minutes_limit, current_period_end, billing_method")
        .eq("status", "active");
      if (subs) {
        for (const s of subs) {
          if (s.user_id) subsMap[s.user_id] = s;
        }
      }
    } catch {
      // subscriptions table may not exist yet
    }

    const users = (data || []).map((u) => ({
      ...u,
      subscriptions: subsMap[u.id] || null,
      manager_email: null as string | null,
    }));

    // Enrich team members with manager email
    const teamUserIds = users.filter((u) => u.role === "team").map((u) => u.id);
    if (teamUserIds.length > 0) {
      try {
        // Get company memberships for team users
        const { data: memberships } = await db
          .from("company_members")
          .select("user_id, company_id")
          .in("user_id", teamUserIds);

        if (memberships && memberships.length > 0) {
          const companyIds = [...new Set(memberships.map((m: { company_id: string }) => m.company_id))];

          // Get managers of those companies
          const { data: managers } = await db
            .from("company_members")
            .select("user_id, company_id")
            .in("company_id", companyIds)
            .eq("role", "manager");

          if (managers && managers.length > 0) {
            const managerUserIds = [...new Set(managers.map((m: { user_id: string }) => m.user_id))];
            const { data: managerProfiles } = await db
              .from("profiles")
              .select("id, email")
              .in("id", managerUserIds);

            // Build lookup: company_id -> manager email
            const companyManagerEmail: Record<string, string> = {};
            if (managerProfiles) {
              for (const mgr of managers) {
                const profile = managerProfiles.find((p: { id: string }) => p.id === mgr.user_id);
                if (profile) {
                  companyManagerEmail[mgr.company_id] = profile.email;
                }
              }
            }

            // Assign manager email to team users
            for (const user of users) {
              if (user.role === "team") {
                const membership = memberships.find((m: { user_id: string }) => m.user_id === user.id);
                if (membership) {
                  user.manager_email = companyManagerEmail[membership.company_id] || null;
                }
              }
            }
          }
        }
      } catch {
        // company_members table may not exist
      }
    }

    return NextResponse.json({
      users,
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// Tier configs (mirrors pricing page)
const TIER_CONFIG: Record<string, { minutes: number; agents: number }[]> = {
  solo: [
    { minutes: 100, agents: 20 },
    { minutes: 250, agents: 50 },
    { minutes: 500, agents: 100 },
    { minutes: 1000, agents: 200 },
  ],
  team: [
    { minutes: 500, agents: 100 },
    { minutes: 1000, agents: 200 },
    { minutes: 2500, agents: 500 },
    { minutes: 5000, agents: 1000 },
  ],
  team_manager: [
    { minutes: 500, agents: 100 },
    { minutes: 1000, agents: 200 },
    { minutes: 2500, agents: 500 },
    { minutes: 5000, agents: 1000 },
  ],
};

// PATCH /api/admin/users - Update a user's role and subscription
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { userId, planRole, tier } = body;

    if (!userId || !planRole) {
      return NextResponse.json(
        { error: "userId and planRole are required" },
        { status: 400 }
      );
    }

    const validRoles = ["free", "solo", "team", "team_manager"];
    if (!validRoles.includes(planRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // 1. Update profile role
    const { error: profileError } = await db
      .from("profiles")
      .update({
        role: planRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Admin update profile error:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 2. Handle subscription
    if (planRole === "free") {
      // Deactivate any existing subscription
      await db
        .from("subscriptions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("status", "active");
    } else if (tier && TIER_CONFIG[planRole]) {
      const tierIndex = tier - 1; // tier is 1-based
      const config = TIER_CONFIG[planRole]?.[tierIndex];
      if (!config) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
      }

      const plan = planRole === "team_manager" ? "team" : planRole;

      // Check if user already has an active subscription
      const { data: existingSub } = await db
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .single();

      const now = new Date().toISOString();
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30); // 30 days from now

      if (existingSub) {
        // Update existing subscription
        await db
          .from("subscriptions")
          .update({
            plan,
            tier,
            minutes_limit: config.minutes,
            agents_limit: config.agents,
            updated_at: now,
          })
          .eq("id", existingSub.id);
      } else {
        // Create new subscription
        await db
          .from("subscriptions")
          .insert({
            user_id: userId,
            plan,
            tier,
            status: "active",
            seconds_used: 0,
            minutes_limit: config.minutes,
            agents_limit: config.agents,
            billing_method: "invoice",
            current_period_start: now,
            current_period_end: periodEnd.toISOString(),
            created_at: now,
            updated_at: now,
          });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
