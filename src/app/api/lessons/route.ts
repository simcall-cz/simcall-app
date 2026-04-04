import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/lessons — returns all lessons from DB
// Optional query params: ?category=sales
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabase.from("lessons").select("*").order("lesson_number");
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch lessons:", error);
    return NextResponse.json({ error: "Failed to load lessons" }, { status: 500 });
  }

  return NextResponse.json(data);
}
