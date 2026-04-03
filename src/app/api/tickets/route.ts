import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { notifySupportTicket } from "@/lib/notifications";

// GET /api/tickets - Get current user's tickets
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET tickets error:", error);
      return NextResponse.json({ tickets: [] });
    }

    return NextResponse.json({ tickets: data || [] });
  } catch (err) {
    console.error("GET /api/tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Předmět a zpráva jsou povinné" },
        { status: 400 }
      );
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
      })
      .select()
      .single();

    if (error) {
      console.error("POST ticket error:", error);
      return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 });
    }

    // Discord notification
    const { data: profile } = await db.from("profiles").select("email").eq("id", user.id).single();
    const posterEmail = profile?.email || user.email || "";
    notifySupportTicket(posterEmail, subject.trim(), message.trim());

    // Admin notification
    try {
      await db.from("admin_notifications").insert({
        title: "Nový support ticket",
        message: `Uživatel ${posterEmail} vytvořil nový ticket: ${subject.trim()}`,
        type: "form",
        link: "/admin/dotazy"
      });
    } catch (e) {
      console.error("Admin notif err:", e);
    }

    return NextResponse.json({ ticket: data });
  } catch (err) {
    console.error("POST /api/tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/tickets - Mark tickets as read
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient();

    // Mark all user's unread tickets as read
    const { error } = await db
      .from("support_tickets")
      .update({ user_read: true })
      .eq("user_id", user.id)
      .eq("user_read", false);

    if (error) {
      console.error("PATCH tickets read error:", error);
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
