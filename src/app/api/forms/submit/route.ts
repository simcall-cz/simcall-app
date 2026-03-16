import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getResend, getFromEmail, ADMIN_EMAIL } from "@/lib/resend";
import ContactFormEmail from "@/emails/ContactFormEmail";
import ContactAutoReplyEmail from "@/emails/ContactAutoReplyEmail";
import MeetingBookedEmail from "@/emails/MeetingBookedEmail";
import MeetingInviteEmail from "@/emails/MeetingInviteEmail";
import { notifyContactForm, notifyMeetingBooked } from "@/lib/notifications";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createCalendarEvent } from "@/lib/google-calendar";
import { generateIcs } from "@/lib/ical";

// POST /api/forms/submit - Submit a form (contact, meeting, enterprise)
export async function POST(request: NextRequest) {
  // Rate limit: max 5 form submissions per minute per IP
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Příliš mnoho požadavků. Zkuste to za chvíli." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  try {
    const body = await request.json();
    const { type, name, email, phone, company, subject, message, meeting_date, meeting_time, team_size } = body as {
      type: "kontakt" | "schuzka" | "enterprise";
      name: string;
      email: string;
      phone?: string;
      company?: string;
      subject?: string;
      message?: string;
      meeting_date?: string;
      meeting_time?: string;
      team_size?: string;
    };

    // Validate required fields
    if (!type || !name || !email) {
      return NextResponse.json(
        { error: "type, name, and email are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["kontakt", "schuzka", "enterprise"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const db = createServerClient();

    const { data, error } = await db
      .from("form_submissions")
      .insert({
        type,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        subject: subject?.trim() || null,
        message: message?.trim() || null,
        meeting_date: meeting_date || null,
        meeting_time: meeting_time || null,
        team_size: team_size || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Form submission error:", error);
      // Don't return — still send emails and notifications below
    }

    // ================================================================
    // Send emails and notifications (always, even if DB insert failed)
    // ================================================================
    const resend = getResend();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (type === "kontakt") {
      // 1. Notify admin about new contact form submission
      await resend.emails.send({
        from: getFromEmail(),
        to: [ADMIN_EMAIL],
        subject: `Nová zpráva z kontaktu: ${trimmedName}`,
        react: ContactFormEmail({
          name: trimmedName,
          email: trimmedEmail,
          subject: subject?.trim() || "Bez předmětu",
          message: message?.trim() || "",
        }),
        replyTo: trimmedEmail,
      });

      // 2. Auto-reply to sender
      await resend.emails.send({
        from: getFromEmail(),
        to: [trimmedEmail],
        subject: "Děkujeme za zprávu — SimCall",
        react: ContactAutoReplyEmail({ name: trimmedName }),
      });

      // 3. Discord notification
      await notifyContactForm(trimmedName, trimmedEmail, message?.trim() || "");
    }

    if (type === "schuzka" || type === "enterprise") {
      let meetLink = "https://meet.google.com/";
      
      try {
        // Attempt to create the Google Calendar event dynamically
        meetLink = await createCalendarEvent({
          name: trimmedName,
          email: trimmedEmail,
          meetingDate: meeting_date || "",
          meetingTime: meeting_time || "",
        });
      } catch (err) {
        console.error("Failed to create Google Calendar event. Falling back to default link.", err);
        meetLink = process.env.GOOGLE_MEET_LINK || meetLink;
      }

      const meetingProps = {
        name: trimmedName,
        email: trimmedEmail,
        company: company?.trim() || "",
        meetingDate: meeting_date || "",
        meetingTime: meeting_time || "",
        teamSize: team_size || undefined,
        note: message?.trim() || undefined,
        meetLink,
      };

      // 1. Confirmation to customer (Email 1)
      await resend.emails.send({
        from: getFromEmail(),
        to: [trimmedEmail],
        subject: `Schůzka potvrzena — ${meeting_date} v ${meeting_time}`,
        react: MeetingBookedEmail({ ...meetingProps, isAdminNotification: false }),
      });

      // 2. Calendar Invite (Email 2)
      const icsString = generateIcs({
        summary: `Schůzka: SimCall Enterprise - ${trimmedName}`,
        description: `Dobrý den,\n\npotvrzujeme Vám termín schůzky ohledně rešení SimCall Enterprise.\n\nOdkaz pro videokonferenci (Google Meet):\n${meetLink}`,
        location: meetLink,
        date: meeting_date || "",
        time: meeting_time || "",
        durationMinutes: 30,
        organizerEmail: "simcallcz@gmail.com",
        organizerName: "SimCall",
        attendeeEmail: trimmedEmail,
        attendeeName: trimmedName,
      });

      await resend.emails.send({
        from: getFromEmail(),
        to: [trimmedEmail],
        subject: `Pozvánka do kalendáře: SimCall Enterprise - ${meeting_date} ${meeting_time}`,
        react: MeetingInviteEmail({
          name: trimmedName,
          meetingDate: meeting_date || "",
          meetingTime: meeting_time || "",
          meetLink,
        }),
        attachments: [
          {
            filename: "pozvanka.ics",
            content: Buffer.from(icsString).toString("base64"),
            contentType: "text/calendar",
          },
        ],
      });

      // 3. Notify admin
      await resend.emails.send({
        from: getFromEmail(),
        to: [ADMIN_EMAIL],
        subject: `Nová schůzka: ${trimmedName} (${company?.trim() || "N/A"})`,
        react: MeetingBookedEmail({ ...meetingProps, isAdminNotification: true }),
        replyTo: trimmedEmail,
      });

      // 4. Discord notification
      await notifyMeetingBooked(trimmedName, trimmedEmail, meeting_date || "", meeting_time || "");
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("POST /api/forms/submit error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
