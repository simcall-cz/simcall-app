import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/users/detail?user_id=xxx - Fetch user auth metadata (phone, company, ico)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const db = createServerClient();

    // Fetch auth user to get raw_user_meta_data (phone, company, ico)
    const { data: authUser, error: authError } = await db.auth.admin.getUserById(userId);

    if (authError || !authUser?.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const meta = authUser.user.user_metadata || {};

    // Fetch user's agents count
    let agentsCount = 0;
    try {
      const { count } = await db
        .from("agents")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      agentsCount = count || 0;
    } catch {
      // agents table may not exist
    }

    // Fetch user's scenarios count
    let scenariosCount = 0;
    try {
      const { count } = await db
        .from("scenarios")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      scenariosCount = count || 0;
    } catch {
      // scenarios table may not exist
    }

    // Fetch last login from auth
    const lastSignIn = authUser.user.last_sign_in_at || null;

    return NextResponse.json({
      phone: meta.phone || null,
      company_name: meta.company_name || null,
      ico: meta.ico || null,
      agents_count: agentsCount,
      scenarios_count: scenariosCount,
      last_sign_in: lastSignIn,
    });
  } catch (err) {
    console.error("GET /api/admin/users/detail error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
