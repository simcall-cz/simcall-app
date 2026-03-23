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
    const { data: availability, error } = await db
      .from("availability")
      .select("*")
      .order("day_of_week", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ availability });
  } catch (error: any) {
    console.error("[api/admin/availability GET]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { availability } = body;

    if (!Array.isArray(availability)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = createServerClient();

    // Since availability table is small (7 days x N slots), we can just replace everything
    // Or we upsert if IDs are provided. The easiest is to delete all and insert new.
    await db.from("availability").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all rows

    const { error } = await db.from("availability").insert(
      availability.map((a: any) => ({
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
        is_active: a.is_active !== undefined ? a.is_active : true,
      }))
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[api/admin/availability POST]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
