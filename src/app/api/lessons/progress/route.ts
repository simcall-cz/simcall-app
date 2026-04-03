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
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
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

  const userId = user.id;
  const supabase = getServiceSupabase();

  // Atomically resolve the next attempt number by retrying on unique constraint
  // violations (Postgres error code 23505). Two concurrent requests can read the
  // same max attempt and race to insert the same attempt number; the loser gets a
  // unique violation and simply re-reads the updated max before retrying. A single
  // retry is sufficient because the second read happens after the winning insert
  // has committed, so the attempt number will be consistent.
  const MAX_RETRIES = 3;

  async function readNextAttempt(): Promise<number> {
    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("attempt")
      .eq("user_id", userId)
      .eq("lesson_number", lessonNumber)
      .eq("sub_scenario", subScenario)
      .order("attempt", { ascending: false })
      .limit(1);

    return existing && existing.length > 0 ? existing[0].attempt + 1 : 1;
  }

  let data = null;
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const nextAttempt = await readNextAttempt();

    const { data: inserted, error } = await supabase
      .from("lesson_progress")
      .insert({
        user_id: userId,
        lesson_number: lessonNumber,
        sub_scenario: subScenario,
        attempt: nextAttempt,
        score,
        call_id: callId || null,
      })
      .select()
      .single();

    // Postgres unique constraint violation — another request won the race for
    // this attempt number. Re-read and retry with the updated max.
    if (error && error.code === "23505") {
      lastError = error;
      continue;
    }

    if (error) {
      return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
    }

    data = inserted;
    lastError = null;
    break;
  }

  if (lastError || !data) {
    const message = lastError
      ? `Failed to insert progress after ${MAX_RETRIES} attempts due to concurrent writes: ${lastError.message}`
      : "Failed to insert progress: no data returned";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
