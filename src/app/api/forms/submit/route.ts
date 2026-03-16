import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getResend, getFromEmail, ADMIN_EMAIL } from "@/lib/resend";
import ContactFormEmail from "@/emails/ContactFormEmail";
import ContactAutoReplyEmail from "@/emails/ContactAutoReplyEmail";
import { notifyContactForm } from "@/lib/notifications";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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
    const { type, name, email, phone, company, subject, message } = body as {
      type: "kontakt";
      name: string;
      email: string;
      phone?: string;
      company?: string;
      subject?: string;
      message?: string;
    };

    // Validate required fields
    if (!type || !name || !email) {
      return NextResponse.json(
        { error: "type, name, and email are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== "kontakt") {
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

    // Removed schuzka block
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
