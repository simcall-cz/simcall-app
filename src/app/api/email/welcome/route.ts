import { NextRequest, NextResponse } from "next/server";
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

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await notifyNewRegistration(email, fullName || "");
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[email/welcome] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
