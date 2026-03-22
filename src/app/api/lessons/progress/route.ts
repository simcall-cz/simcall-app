import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: fetch progress for the authenticated user
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("lesson_number", { ascending: true })
    .order("sub_scenario", { ascending: true })
    .order("attempt", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data || [] });
}

// POST: save a new attempt result
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { lessonNumber, subScenario, score, callId } = body;

  // Validate
  if (!lessonNumber || lessonNumber < 1 || lessonNumber > 100) {
    return NextResponse.json({ error: "Invalid lessonNumber (1-100)" }, { status: 400 });
  }
  if (!subScenario || subScenario < 1 || subScenario > 3) {
    return NextResponse.json({ error: "Invalid subScenario (1-3)" }, { status: 400 });
  }
  if (score === undefined || score < 0 || score > 100) {
    return NextResponse.json({ error: "Invalid score (0-100)" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Get the next attempt number
  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("attempt")
    .eq("user_id", user.id)
    .eq("lesson_number", lessonNumber)
    .eq("sub_scenario", subScenario)
    .order("attempt", { ascending: false })
    .limit(1);

  const nextAttempt = existing && existing.length > 0 ? existing[0].attempt + 1 : 1;

  const { data, error } = await supabase
    .from("lesson_progress")
    .insert({
      user_id: user.id,
      lesson_number: lessonNumber,
      sub_scenario: subScenario,
      attempt: nextAttempt,
      score,
      call_id: callId || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
