import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/calls - List all calls across all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const userId = searchParams.get("user_id");

    let query = db
      .from("calls")
      .select(
        `
        *,
        agents:agent_id (*),
        scenarios:scenario_id (*),
        feedback (*)
      `
      )
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: calls, error } = await query;

    if (error) {
      console.warn("Admin calls query error:", error.message);
      return NextResponse.json({ calls: [] });
    }

    // Enrich with user info from profiles
    const userIds = [...new Set((calls || []).map((c) => c.user_id).filter(Boolean))];
    let profileMap: Record<string, { full_name: string | null; email: string }> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await db
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p) => [p.id, { full_name: p.full_name, email: p.email }])
        );
      }
    }

    const enriched = (calls || []).map((call) => ({
      ...call,
      user_name: profileMap[call.user_id]?.full_name || null,
      user_email: profileMap[call.user_id]?.email || null,
    }));

    return NextResponse.json({ calls: enriched });
  } catch (err) {
    console.error("GET /api/admin/calls error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
