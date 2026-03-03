import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

// GET /api/me/role - Returns the current user's profile role (server-side, bypasses RLS)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ role: "free" });
    }

    const db = createServerClient();
    const { data } = await db
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ role: data?.role || "free" });
  } catch {
    return NextResponse.json({ role: "free" });
  }
}
