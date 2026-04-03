import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getResend, getFromEmail } from "@/lib/resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { notifyNewRegistration } from "@/lib/notifications";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/email/welcome — Send welcome email after registration
export async function POST(request: NextRequest) {
  // Rate limit: max 3 requests per minute per IP (sending emails costs money)
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  try {
    const { email, fullName, planName } = (await request.json()) as {
      email: string;
      fullName: string;
      planName: string;
    };

    if (!email || typeof email !== "string" || !fullName || typeof fullName !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (email.length > 320 || fullName.length > 200) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const resend = getResend();

    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: [email],
      subject: "Vítejte v SimCall! 🎉",
      react: WelcomeEmail({ fullName: fullName || "uživateli", planName: planName || "Demo" }),
    });

    if (error) {
      console.error("[email/welcome] Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    await notifyNewRegistration(email, fullName || "");

    // Admin UI Notification
    try {
      const db = createServerClient();
      const { error: notifError } = await db.from("admin_notifications").insert({
        title: "Nová registrace",
        message: `${fullName} (${email}) se právě zaregistroval(a) s tarifem ${planName || "Demo"}.`,
        type: "user",
        link: "/admin/uzivatele"
      });
      if (notifError) console.error("Admin notif DB insert err:", notifError);
    } catch (e) {
      console.error("Failed to insert admin notification", e);
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[email/welcome] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
