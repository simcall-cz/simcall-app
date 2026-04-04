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
      // Demo user: show agents for first 5 lessons (all tiers)
      // Look up topic_ids for lessons 1-5, then fetch their agents
      const { data: demoLessons } = await supabase
        .from("lessons")
        .select("id")
        .gte("lesson_number", 1)
        .lte("lesson_number", 5);

      const demoTopicIds = (demoLessons || []).map((l: { id: string }) => l.id);

      const { data: demoAgents, error: demoError } = await supabase
        .from("agents")
        .select("*")
        .in("topic_id", demoTopicIds)
        .not("elevenlabs_agent_id", "is", null)
        .eq("status", "approved");

      if (demoError) {
        return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
      }
      return NextResponse.json({
        agents: demoAgents || [],
        total: demoAgents?.length || 0,
        limit: 15,
      });
    }

    // Support optional filters: ?topic_id=xxx&status=approved
    const { searchParams } = new URL(request.url);
    const topicIdFilter = searchParams.get("topic_id");
    const statusFilter = searchParams.get("status");

    // Fetch agents that have an ElevenLabs agent configured (paid users)
    let query = supabase
      .from("agents")
      .select("*")
      .not("elevenlabs_agent_id", "is", null);

    if (topicIdFilter) {
      query = query.eq("topic_id", topicIdFilter);
    }
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    query = query.order("created_at", { ascending: true });

    const { data: agents, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
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
