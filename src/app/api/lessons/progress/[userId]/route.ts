import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: manager fetches progress for a specific team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  const supabase = getServiceSupabase();

  // Verify the requester is a manager of the target user's company
  const { data: requesterMembership } = await supabase
    .from("company_members")
    .select("company_id, role")
    .eq("user_id", user.id)
    .eq("role", "manager")
    .single();

  if (!requesterMembership) {
    return NextResponse.json({ error: "Not a manager" }, { status: 403 });
  }

  // Verify target user is in the same company
  const { data: targetMembership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .eq("company_id", requesterMembership.company_id)
    .single();

  if (!targetMembership) {
    return NextResponse.json({ error: "User not in your team" }, { status: 403 });
  }

  // Fetch progress
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .order("lesson_number", { ascending: true })
    .order("sub_scenario", { ascending: true })
    .order("attempt", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch user profile info
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", userId)
    .single();

  return NextResponse.json({
    user: {
      id: userId,
      fullName: profile?.full_name || "",
      email: profile?.email || "",
    },
    progress: data || [],
  });
}
