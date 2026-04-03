import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { notifyCallDispute } from "@/lib/notifications";

const VALID_REASONS = [
  "Nesouhlasím s hodnocením",
  "Agent byl zmatený / nereagoval správně",
  "Technický problém (zvuk, přerušení)",
  "Hovor se ukončil předčasně",
  "Jiný důvod",
];

// POST /api/calls/[id]/dispute — create a dispute for a call
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { reason, message } = body;

    if (!reason?.trim() || !VALID_REASONS.includes(reason.trim())) {
      return NextResponse.json(
        { error: "Neplatný důvod reklamace" },
        { status: 400 }
      );
    }

    if (reason === "Jiný důvod" && !message?.trim()) {
      return NextResponse.json(
        { error: "Při výběru 'Jiný důvod' je popis povinný" },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Verify call belongs to user
    const { data: call, error: callError } = await db
      .from("calls")
      .select("id, user_id, duration_seconds, agent_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (callError || !call) {
      return NextResponse.json(
        { error: "Hovor nebyl nalezen" },
        { status: 404 }
      );
    }

    // Check for existing pending dispute on this call
    const { data: existingDispute } = await db
      .from("call_disputes")
      .select("id")
      .eq("call_id", id)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (existingDispute) {
      return NextResponse.json(
        { error: "K tomuto hovoru již existuje otevřená reklamace" },
        { status: 409 }
      );
    }

    // Create dispute
    const { data: dispute, error: disputeError } = await db
      .from("call_disputes")
      .insert({
        call_id: id,
        user_id: user.id,
        reason: reason.trim(),
        message: message?.trim() || null,
        status: "pending",
      })
      .select()
      .single();

    if (disputeError) {
      console.error("POST dispute error:", disputeError);
      return NextResponse.json(
        { error: "Failed to create dispute" },
        { status: 500 }
      );
    }

    // Get user email for notifications
    const { data: profile } = await db
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();
    const userEmail = profile?.email || user.email || "";

    // Discord notification
    await notifyCallDispute(userEmail, reason.trim(), message?.trim() || "");

    // Admin notification
    try {
      await db.from("admin_notifications").insert({
        title: "Nová reklamace hovoru",
        message: `Uživatel ${userEmail} nahlásil problém s hovorem: ${reason.trim()}`,
        type: "form",
        link: "/admin/refundace",
      });
    } catch (e) {
      console.error("Admin notif err:", e);
    }

    return NextResponse.json({ dispute });
  } catch (err) {
    console.error("POST /api/calls/[id]/dispute error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/calls/[id]/dispute — get dispute status for a call
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
    const db = createServerClient();

    const { data: dispute } = await db
      .from("call_disputes")
      .select("*")
      .eq("call_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ dispute: dispute || null });
  } catch (err) {
    console.error("GET /api/calls/[id]/dispute error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
