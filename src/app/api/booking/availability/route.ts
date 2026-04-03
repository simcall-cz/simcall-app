import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    
    if (!dateStr) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const requestedDate = new Date(dateStr);
    const dayOfWeek = requestedDate.getDay(); // 0 is Sunday, 1 is Monday...

    const db = createServerClient();
    
    // 1. Get admin's weekly availability rule for this day
    const { data: avail } = await db
      .from("availability")
      .select("*")
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true)
      .single();

    if (!avail) {
      return NextResponse.json({ slots: [] }); // Admin is not available on this day
    }

    // 2. Get existing meetings for this specific date
    // We check meetings from start of day to end of day
    const dayStart = new Date(requestedDate);
    dayStart.setHours(0, 0, 0, 0);
    const startOfDay = dayStart.toISOString();
    const dayEnd = new Date(requestedDate);
    dayEnd.setHours(23, 59, 59, 999);
    const endOfDay = dayEnd.toISOString();

    const { data: meetings, error: meetingsError } = await db
      .from("meetings")
      .select("start_time, end_time")
      .neq("status", "cancelled")
      .gte("start_time", startOfDay)
      .lte("start_time", endOfDay);

    if (meetingsError) throw meetingsError;

    // 3. Generate 30-minute slots between `start_time` and `end_time`
    const durationMin = 30; // 30 minutes booking length
    const slots = [];
    
    const ruleStartObj = new Date(requestedDate.toISOString().split("T")[0] + "T" + avail.start_time);
    const ruleEndObj = new Date(requestedDate.toISOString().split("T")[0] + "T" + avail.end_time);

    let currentSlotStart = ruleStartObj;

    const now = new Date();

    while (currentSlotStart < ruleEndObj) {
      // Slot end time
      const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMin * 60000);
      
      // Stop generating slots if it exceeds rule end time
      if (currentSlotEnd > ruleEndObj) break;

      // Check if slot is in the past
      if (currentSlotStart > now) {
        // Check if overlaps with any existing meetings
        let isBooked = false;
        if (meetings) {
          for (const m of meetings) {
            const mStart = new Date(m.start_time);
            const mEnd = new Date(m.end_time);
            
            // Overlap condition: slotStart < meetingEnd AND slotEnd > meetingStart
            if (currentSlotStart < mEnd && currentSlotEnd > mStart) {
              isBooked = true;
              break;
            }
          }
        }

        if (!isBooked) {
          slots.push({
            time: new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Prague" }).format(currentSlotStart),
            isoDate: currentSlotStart.toISOString()
          });
        }
      }

      currentSlotStart = currentSlotEnd; 
    }

    return NextResponse.json({ slots });
  } catch (error: any) {
    console.error("[api/booking/availability GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
