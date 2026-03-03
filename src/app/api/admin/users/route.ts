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
    const planRole = searchParams.get("plan_role") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query for profiles with subscription join
    let query = db
      .from("profiles")
      .select(
        `
        id,
        email,
        full_name,
        plan_role,
        created_at,
        subscriptions (
          id,
          plan,
          tier,
          status,
          calls_used,
          calls_limit,
          current_period_end
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter (email or name)
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%`
      );
    }

    // Apply plan_role filter
    if (planRole) {
      query = query.eq("plan_role", planRole);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("Admin users query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      users: data || [],
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

// PATCH /api/admin/users - Update a user's plan_role
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { userId, planRole } = body;

    if (!userId || !planRole) {
      return NextResponse.json(
        { error: "userId and planRole are required" },
        { status: 400 }
      );
    }

    const validRoles = ["demo", "solo", "team", "admin"];
    if (!validRoles.includes(planRole)) {
      return NextResponse.json(
        { error: `Invalid planRole. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from("profiles")
      .update({
        plan_role: planRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Admin update user error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
