import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { createMeetingEvent } from "@/lib/google-calendar";
// import { sendMeetingConfirmationEmail } from "@/lib/emails"; // We will add this later

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guest_name, guest_email, guest_phone, guest_notes, start_time } = body;

    if (!guest_name || !guest_email || !start_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(start_time);
    const end = new Date(start.getTime() + 30 * 60000); // 30 minutes duration

    // 1. Double check if someone booked this exact slot in the meantime
    const db = createServerClient();
    const { data: overlapping } = await db
      .from("meetings")
      .select("id")
      .neq("status", "cancelled")
      .lt("start_time", end.toISOString())
      .gt("end_time", start.toISOString());

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ error: "Tento termín již někdo obsadil, vyberte prosím jiný." }, { status: 409 });
    }

    // 2. Create the Google Calendar Event & Get Meet Link
    let googleData;
    let fallbackMeetLink = process.env.STATIC_MEET_LINK || "https://meet.google.com/";
    try {
      googleData = await createMeetingEvent({
        guestName: guest_name,
        guestEmail: guest_email,
        startTime: start,
        endTime: end,
        description: `Telefon: ${guest_phone || "Nezadáno"}\nPoznámka: ${guest_notes || "Nezadáno"}`
      });
    } catch (gcalError) {
      console.error("Warning: Failed to create GCal event:", gcalError);
      // We log error but proceed to save the DB record so we don't lose the booking
      googleData = {
        eventId: null,
        meetLink: fallbackMeetLink,
        htmlLink: null
      };
    }

    // 3. Save to database
    const { data: meeting, error: dbError } = await db
      .from("meetings")
      .insert({
        guest_name,
        guest_email,
        guest_phone,
        guest_notes,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        google_event_id: googleData.eventId,
        meet_link: googleData.meetLink || fallbackMeetLink,
        status: "scheduled"
      })
      .select()
      .single();

    // 4. Send Confirmation Email
    try {
      const { getResend, getFromEmail, ADMIN_EMAIL } = await import("@/lib/resend");
      const resend = getResend();
      const MeetingConfirmationEmail = (await import("@/emails/MeetingConfirmationEmail")).default;
      
      const emailHtml = MeetingConfirmationEmail({
        guestName: guest_name,
        startTime: start,
        meetLink: googleData.meetLink || fallbackMeetLink,
      });

      await resend.emails.send({
        from: getFromEmail(),
        to: [guest_email],
        bcc: [ADMIN_EMAIL || "simcallcz@gmail.com"],
        subject: "Potvrzení schůzky: SimCall",
        react: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true, meeting });
  } catch (error: any) {
    console.error("[api/booking POST]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
