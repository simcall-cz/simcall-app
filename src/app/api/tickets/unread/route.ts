import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/tickets/unread - Get count of unread ticket responses
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const db = createServerClient();
    const { count, error } = await db
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("user_read", false);

    if (error) {
      console.error("GET unread tickets error:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
