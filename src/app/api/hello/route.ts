import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("scenarios").select("id, image_url").limit(5);
  return NextResponse.json({ data, error });
}
