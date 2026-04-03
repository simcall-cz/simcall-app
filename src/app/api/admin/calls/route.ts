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
    function safeInt(val: string | null, fallback: number, max: number): number {
      const n = parseInt(val || String(fallback), 10);
      if (isNaN(n) || n < 0) return fallback;
      return Math.min(n, max);
    }
    const limit = safeInt(searchParams.get("limit"), 100, 200);
    const offset = safeInt(searchParams.get("offset"), 0, 100000);
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
      const { data: profiles, error: profilesError } = await db
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profilesError) {
        console.warn("Failed to fetch profiles for calls enrichment:", profilesError.message);
      }

      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p) => [p.id, { full_name: p.full_name, email: p.email }])
        );
      }
    }

    const enriched = (calls || []).map((call) => {
      const profile = profileMap[call.user_id];
      const displayName = profile?.full_name || profile?.email?.split("@")[0] || null;
      return {
        ...call,
        user_name: displayName,
        user_email: profile?.email || null,
      };
    });

    return NextResponse.json({ calls: enriched });
  } catch (err) {
    console.error("GET /api/admin/calls error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
