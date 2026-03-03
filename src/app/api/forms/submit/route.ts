import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getResend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import ContactFormEmail from "@/emails/ContactFormEmail";
import ContactAutoReplyEmail from "@/emails/ContactAutoReplyEmail";
import MeetingBookedEmail from "@/emails/MeetingBookedEmail";

// POST /api/forms/submit - Submit a form (contact, meeting, enterprise)
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ================================================================
    // Send emails (async, don't block response)
    // ================================================================
    const resend = getResend();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (type === "kontakt") {
      // 1. Notify admin about new contact form submission
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Nová zpráva z kontaktu: ${trimmedName}`,
        react: ContactFormEmail({
          name: trimmedName,
          email: trimmedEmail,
          subject: subject?.trim() || "Bez předmětu",
          message: message?.trim() || "",
        }),
        replyTo: trimmedEmail,
      }).catch((err) => console.error("[email] Contact admin notification failed:", err));

      // 2. Auto-reply to sender
      resend.emails.send({
        from: FROM_EMAIL,
        to: [trimmedEmail],
        subject: "Děkujeme za zprávu — SimCall",
        react: ContactAutoReplyEmail({ name: trimmedName }),
      }).catch((err) => console.error("[email] Contact auto-reply failed:", err));
    }

    if (type === "schuzka" || type === "enterprise") {
      const meetingProps = {
        name: trimmedName,
        email: trimmedEmail,
        company: company?.trim() || "",
        meetingDate: meeting_date || "",
        meetingTime: meeting_time || "",
        teamSize: team_size || undefined,
        note: message?.trim() || undefined,
      };

      // 1. Confirmation to customer
      resend.emails.send({
        from: FROM_EMAIL,
        to: [trimmedEmail],
        subject: `Schůzka potvrzena — ${meeting_date} v ${meeting_time}`,
        react: MeetingBookedEmail({ ...meetingProps, isAdminNotification: false }),
      }).catch((err) => console.error("[email] Meeting customer confirmation failed:", err));

      // 2. Notify admin
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Nová schůzka: ${trimmedName} (${company?.trim() || "N/A"})`,
        react: MeetingBookedEmail({ ...meetingProps, isAdminNotification: true }),
        replyTo: trimmedEmail,
      }).catch((err) => console.error("[email] Meeting admin notification failed:", err));
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("POST /api/forms/submit error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
