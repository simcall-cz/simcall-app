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
    const { data: meetings, error } = await db
      .from("meetings")
      .select("*")
      .order("start_time", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ meetings });
  } catch (error: any) {
    console.error("[api/admin/meetings GET]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
