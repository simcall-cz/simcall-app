import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/disputes — list all call disputes
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, approved, rejected

    let query = db
      .from("call_disputes")
      .select(`
        *,
        calls:call_id (
          id,
          date,
          duration_seconds,
          success_rate,
          audio_url,
          agent_id,
          agents:agent_id (name, personality)
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET admin disputes error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with user emails
    const disputes = data || [];
    const userIds = [...new Set(disputes.map((d) => d.user_id))];

    let userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await db
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      if (profiles) {
        userMap = Object.fromEntries(
          profiles.map((p) => [p.id, p.full_name || p.email || p.id])
        );
      }
    }

    const enriched = disputes.map((d) => ({
      ...d,
      user_name: userMap[d.user_id] || d.user_id,
    }));

    return NextResponse.json({ disputes: enriched });
  } catch (err) {
    console.error("GET /api/admin/disputes error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
