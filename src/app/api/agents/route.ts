import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/agents - List agents available to the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // Determine agent limit from subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("agents_limit")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const agentsLimit = subscription?.agents_limit ?? 1; // demo = 1

    if (!subscription) {
      // Demo user: show agents for first 5 lessons (easy/medium/hard)
      const demoIds = [
        "ag-1-easy", "ag-1-medium", "ag-1-hard",
        "ag-2-easy", "ag-2-medium", "ag-2-hard",
        "ag-3-easy", "ag-3-medium", "ag-3-hard",
        "ag-4-easy", "ag-4-medium", "ag-4-hard",
        "ag-5-easy", "ag-5-medium", "ag-5-hard",
      ];
      const { data: demoAgents, error: demoError } = await supabase
        .from("agents")
        .select("*")
        .in("id", demoIds)
        .not("elevenlabs_agent_id", "is", null);
      if (demoError) {
        return NextResponse.json({ error: demoError.message }, { status: 500 });
      }
      return NextResponse.json({
        agents: demoAgents || [],
        total: demoAgents?.length || 0,
        limit: 15,
      });
    }

    // Fetch ALL agents that have an ElevenLabs agent configured (paid users)
    const { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .not("elevenlabs_agent_id", "is", null)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      agents: agents || [],
      total: agents?.length || 0,
      limit: agentsLimit,
    });
  } catch (err) {
    console.error("GET /api/agents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
