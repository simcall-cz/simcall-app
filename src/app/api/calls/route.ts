import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest, checkMinuteLimit } from "@/lib/auth";

// GET /api/calls - List all calls for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");

    let query = supabase
      .from("calls")
      .select(
        `
        *,
        agents:agent_id (*),
        scenarios:scenario_id (*),
        feedback (*)
      `
      )
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ calls: data });
  } catch (err) {
    console.error("GET /api/calls error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/calls - Create a new call (start training session)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    const body = await request.json();
    const { agent_id, scenario_id } = body;

    if (!agent_id || !scenario_id) {
      return NextResponse.json(
        { error: "agent_id and scenario_id are required" },
        { status: 400 }
      );
    }

    // ---- Minute limit check ----
    const limitCheck = await checkMinuteLimit(user.id);
    if (!limitCheck.canCall) {
      return NextResponse.json(
        {
          error: "Limit minut vyčerpán",
          secondsUsed: limitCheck.secondsUsed,
          minutesLimit: limitCheck.minutesLimit,
          planRole: limitCheck.planRole,
        },
        { status: 403 }
      );
    }

    // Look up ElevenLabs agent ID
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("elevenlabs_agent_id")
      .eq("id", agent_id)
      .single();

    if (agentError || !agent?.elevenlabs_agent_id) {
      return NextResponse.json(
        { error: "Agent not found or not configured in ElevenLabs" },
        { status: 404 }
      );
    }

    // Get a signed URL from ElevenLabs for WebRTC
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agent.elevenlabs_agent_id}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!elevenLabsResponse.ok) {
      const errText = await elevenLabsResponse.text();
      console.error("ElevenLabs signed URL error:", errText);
      return NextResponse.json(
        { error: "Failed to get ElevenLabs signed URL" },
        { status: 502 }
      );
    }

    const { signed_url } = await elevenLabsResponse.json();

    // Create call record in Supabase
    const { data: call, error: callError } = await supabase
      .from("calls")
      .insert({
        user_id: user.id,
        agent_id,
        scenario_id,
        status: "pending",
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (callError) {
      return NextResponse.json(
        { error: callError.message },
        { status: 500 }
      );
    }

    // Usage is now tracked at call COMPLETION (in /api/calls/[id]/process)

    return NextResponse.json({
      call_id: call.id,
      signed_url,
      elevenlabs_agent_id: agent.elevenlabs_agent_id,
    });
  } catch (err) {
    console.error("POST /api/calls error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
