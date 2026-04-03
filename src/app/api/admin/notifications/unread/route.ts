import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const { count, error } = await db
      .from("admin_notifications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("[api/admin/notifications/unread GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
