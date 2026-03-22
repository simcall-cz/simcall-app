import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";
import { getResend, getFromEmail } from "@/lib/resend";
import TicketResponseEmail from "@/emails/TicketResponseEmail";

// GET /api/admin/tickets - Get all tickets (admin)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let query = db
      .from("support_tickets")
      .select("*, profiles(email, full_name)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admin GET tickets error:", error);
      return NextResponse.json({ tickets: [] });
    }

    return NextResponse.json({ tickets: data || [] });
  } catch (err) {
    console.error("GET /api/admin/tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/tickets - Update ticket status and/or respond
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { ticketId, status, adminNote } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { error: "ticketId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["open", "in_progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Build update data
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // If admin wrote a response, mark as unread for user
    if (adminNote !== undefined && adminNote.trim()) {
      updateData.admin_note = adminNote;
      updateData.user_read = false;
    }

    const { error } = await db
      .from("support_tickets")
      .update(updateData)
      .eq("id", ticketId);

    if (error) {
      console.error("Admin PATCH ticket error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification to user if admin wrote a response
    if (adminNote?.trim()) {
      try {
        // Fetch ticket details + user profile
        const { data: ticket } = await db
          .from("support_tickets")
          .select("*, profiles(email, full_name)")
          .eq("id", ticketId)
          .single();

        if (ticket?.profiles?.email) {
          const resend = getResend();
          await resend.emails.send({
            from: getFromEmail(),
            to: [ticket.profiles.email],
            subject: `Odpověď na váš tiket: ${ticket.subject}`,
            react: TicketResponseEmail({
              customerName: ticket.profiles.full_name || "zákazníku",
              ticketSubject: ticket.subject,
              ticketMessage: ticket.message,
              adminResponse: adminNote.trim(),
            }),
          });
        }
      } catch (emailErr) {
        // Log but don't fail the status update
        console.error("Failed to send ticket response email:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/tickets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
