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

    // Support optional filters: ?topic_id=xxx&status=approved
    const { searchParams } = new URL(request.url);
    const topicIdFilter = searchParams.get("topic_id");
    const statusFilter = searchParams.get("status");

    // If topic_id filter is provided, always query by it (both demo and paid)
    // This is used by the lesson detail page to fetch agents for a specific lesson
    if (topicIdFilter) {
      let query = supabase
        .from("agents")
        .select("*")
        .eq("topic_id", topicIdFilter);

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
    }

    if (!subscription) {
      // Demo user (no topic_id filter): show agents for first 5 lessons (all tiers)
      const { data: demoLessons } = await supabase
        .from("lessons")
        .select("id")
        .gte("lesson_number", 1)
        .lte("lesson_number", 5);

      const demoTopicIds = (demoLessons || []).map((l: { id: string }) => l.id);

      let demoQuery = supabase
        .from("agents")
        .select("*")
        .in("topic_id", demoTopicIds)
        .eq("status", "approved");

      if (statusFilter) {
        demoQuery = demoQuery.eq("status", statusFilter);
      }

      const { data: demoAgents, error: demoError } = await demoQuery;

      if (demoError) {
        return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
      }
      return NextResponse.json({
        agents: demoAgents || [],
        total: demoAgents?.length || 0,
        limit: 15,
      });
    }

    // Paid users: fetch all agents
    let query = supabase
      .from("agents")
      .select("*")
      .not("elevenlabs_agent_id", "is", null);

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
