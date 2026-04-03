import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { createMeetingEvent } from "@/lib/google-calendar";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
// import { sendMeetingConfirmationEmail } from "@/lib/emails"; // We will add this later

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip, 3, 60_000); // 3 bookings per minute
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkuste to za chvíli." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { guest_name, guest_email, guest_phone, guest_notes, start_time } = body;

    if (!guest_name || !guest_email || !start_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate lengths
    if (guest_name.length > 200 || guest_email.length > 320) {
      return NextResponse.json({ error: "Vstupní data jsou příliš dlouhá" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(guest_email)) {
      return NextResponse.json({ error: "Neplatný formát emailu" }, { status: 400 });
    }
    if (guest_phone && guest_phone.length > 30) {
      return NextResponse.json({ error: "Telefonní číslo je příliš dlouhé" }, { status: 400 });
    }
    if (guest_notes && guest_notes.length > 2000) {
      return NextResponse.json({ error: "Poznámka je příliš dlouhá" }, { status: 400 });
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

    // 3.5 Post-insert overlap check (optimistic lock to close the TOCTOU window).
    // Two concurrent requests can both pass the pre-insert check above and both
    // reach the insert. Re-querying here — excluding the row we just created —
    // detects that situation and rolls it back before any side-effects proceed.
    if (meeting) {
      const { data: postInsertOverlap } = await db
        .from("meetings")
        .select("id")
        .neq("status", "cancelled")
        .neq("id", meeting.id)
        .lt("start_time", end.toISOString())
        .gt("end_time", start.toISOString());

      if (postInsertOverlap && postInsertOverlap.length > 0) {
        await db.from("meetings").delete().eq("id", meeting.id);
        return NextResponse.json(
          { error: "Tento termín již někdo obsadil, vyberte prosím jiný." },
          { status: 409 }
        );
      }
    }

    // 3.6 Create an admin notification
    try {
      const { error: notifError } = await db.from("admin_notifications").insert({
        title: "Nová schůzka",
        message: `${guest_name} si rezervoval(a) schůzku na ${new Intl.DateTimeFormat("cs-CZ", { dateStyle: "short", timeZone: "Europe/Prague" }).format(start)} v ${new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Prague" }).format(start)}.`,
        type: "meeting",
        link: "/admin/schuzky"
      });
      if (notifError) console.error("Admin notif DB insert error:", notifError);
    } catch (e) {
      console.error("Failed to create admin notification:", e);
    }

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
