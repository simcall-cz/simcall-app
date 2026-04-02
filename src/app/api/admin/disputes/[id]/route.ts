import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// PATCH /api/admin/disputes/[id] — resolve a dispute (approve/reject + optional refund)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, user } = await verifyAdmin(request);
    if (!isAdmin || !user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, admin_note, refund } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status musí být 'approved' nebo 'rejected'" },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Get the dispute with call info
    const { data: dispute, error: disputeError } = await db
      .from("call_disputes")
      .select("*, calls:call_id (id, user_id, duration_seconds)")
      .eq("id", id)
      .single();

    if (disputeError || !dispute) {
      return NextResponse.json(
        { error: "Reklamace nebyla nalezena" },
        { status: 404 }
      );
    }

    if (dispute.status !== "pending") {
      return NextResponse.json(
        { error: "Tato reklamace již byla vyřešena" },
        { status: 409 }
      );
    }

    let refundedSeconds = 0;

    // Process refund if approved and requested
    if (status === "approved" && refund && dispute.calls) {
      const call = dispute.calls as { id: string; user_id: string; duration_seconds: number };
      refundedSeconds = call.duration_seconds || 0;

      if (refundedSeconds > 0) {
        // Try to refund from subscription
        const { data: sub } = await db
          .from("subscriptions")
          .select("id, seconds_used")
          .eq("user_id", call.user_id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sub) {
          // Subtract seconds from subscription pool
          const newSecondsUsed = Math.max(0, (sub.seconds_used || 0) - refundedSeconds);
          await db
            .from("subscriptions")
            .update({
              seconds_used: newSecondsUsed,
              updated_at: new Date().toISOString(),
            })
            .eq("id", sub.id);
        } else {
          // Demo user — no subscription, zero out the call duration
          // so it doesn't count against their free limit
          await db
            .from("calls")
            .update({
              duration_seconds: 0,
              updated_at: new Date().toISOString(),
            })
            .eq("id", call.id);
        }
      }
    }

    // Update dispute status
    const { data: updated, error: updateError } = await db
      .from("call_disputes")
      .update({
        status,
        admin_note: admin_note?.trim() || null,
        refunded_seconds: refundedSeconds,
        resolved_at: new Date().toISOString(),
        resolved_by: user.email || "admin",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("PATCH dispute error:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Create in-app notification for the user (via support_tickets mechanism)
    try {
      const statusLabel = status === "approved" ? "schválena" : "zamítnuta";
      const refundLabel = refundedSeconds > 0
        ? ` Vráceno ${Math.ceil(refundedSeconds / 60)} min.`
        : "";

      await db.from("support_tickets").insert({
        user_id: dispute.user_id,
        subject: `Reklamace hovoru ${statusLabel}`,
        message: `Vaše reklamace hovoru byla ${statusLabel}.${refundLabel}${admin_note ? ` Poznámka: ${admin_note.trim()}` : ""}`,
        status: "resolved",
        admin_note: admin_note?.trim() || `Reklamace ${statusLabel}.${refundLabel}`,
        user_read: false,
      });
    } catch (e) {
      console.error("User notification err:", e);
    }

    return NextResponse.json({
      dispute: updated,
      refunded_seconds: refundedSeconds,
    });
  } catch (err) {
    console.error("PATCH /api/admin/disputes/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
