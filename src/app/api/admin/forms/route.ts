import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/forms - List all form submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    try {
      let query = db
        .from("form_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (type) {
        query = query.eq("type", type);
      }
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        // Table may not exist — return empty
        console.warn("Form submissions query error (table may not exist):", error.message);
        return NextResponse.json({
          submissions: [],
          counts: { total: 0, new: 0, read: 0, replied: 0, kontakt: 0, schuzka: 0, enterprise: 0 },
        });
      }

      // Count by status
      const { data: allSubs } = await db
        .from("form_submissions")
        .select("status, type");

      const counts = {
        total: allSubs?.length || 0,
        new: allSubs?.filter((s) => s.status === "new").length || 0,
        read: allSubs?.filter((s) => s.status === "read").length || 0,
        replied: allSubs?.filter((s) => s.status === "replied").length || 0,
        kontakt: allSubs?.filter((s) => s.type === "kontakt").length || 0,
        schuzka: allSubs?.filter((s) => s.type === "schuzka").length || 0,
        enterprise: allSubs?.filter((s) => s.type === "enterprise").length || 0,
      };

      return NextResponse.json({ submissions: data || [], counts });
    } catch {
      return NextResponse.json({
        submissions: [],
        counts: { total: 0, new: 0, read: 0, replied: 0, kontakt: 0, schuzka: 0, enterprise: 0 },
      });
    }
  } catch (err) {
    console.error("GET /api/admin/forms error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/forms - Update submission status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["new", "read", "replied", "archived"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const { error } = await db
      .from("form_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/forms error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
