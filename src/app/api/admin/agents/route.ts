import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/agents - List all agents
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();

    const { data, error } = await db
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin agents query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: data || [] });
  } catch (err) {
    console.error("GET /api/admin/agents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();

    const {
      name,
      personality,
      description,
      difficulty,
      avatar_initials,
      traits,
      elevenlabs_agent_id,
      category,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Agent name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from("agents")
      .insert({
        name,
        personality: personality || null,
        description: description || null,
        difficulty: difficulty || "medium",
        avatar_initials: avatar_initials || name.substring(0, 2).toUpperCase(),
        traits: traits || [],
        elevenlabs_agent_id: elevenlabs_agent_id || null,
        category: category || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Admin create agent error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agent: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/agents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/agents - Update an existing agent
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Agent id is required" },
        { status: 400 }
      );
    }

    // Only allow updating known fields
    const allowedFields = [
      "name",
      "personality",
      "description",
      "difficulty",
      "avatar_initials",
      "traits",
      "elevenlabs_agent_id",
      "category",
    ];

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    for (const key of allowedFields) {
      if (key in fields) {
        updateData[key] = fields[key];
      }
    }

    const { data, error } = await db
      .from("agents")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin update agent error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agent: data });
  } catch (err) {
    console.error("PATCH /api/admin/agents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/agents - Delete an agent
export async function DELETE(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Agent id is required" },
        { status: 400 }
      );
    }

    const { error } = await db.from("agents").delete().eq("id", id);

    if (error) {
      console.error("Admin delete agent error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/agents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
