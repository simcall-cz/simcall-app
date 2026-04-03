import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/calls/[id] - Get a single call with transcript and feedback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerClient();

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const isAdmin = profile?.role === "admin";

    let query = supabase
      .from("calls")
      .select(
        `
        *,
        agents:agent_id (*),
        scenarios:scenario_id (*),
        feedback (*),
        transcripts (*)
      `
      )
      .eq("id", id);

    // Non-admins can only see their own calls
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data: call, error: callError } = await query
      .order("sort_order", {
        referencedTable: "transcripts",
        ascending: true,
      })
      .single();

    if (callError) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ call });
  } catch (err) {
    console.error("GET /api/calls/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/calls/[id] - Update call status, duration, conversation_id etc
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerClient();
    const body = await request.json();

    const allowedFields = [
      "status",
      "duration_seconds",
      "conversation_id",
      "success_rate",
      "audio_url",
    ];

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: call, error } = await supabase
      .from("calls")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update call" }, { status: 500 });
    }

    return NextResponse.json({ call });
  } catch (err) {
    console.error("PATCH /api/calls/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
