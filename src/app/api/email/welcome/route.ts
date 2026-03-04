import { NextRequest, NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { notifyNewRegistration } from "@/lib/notifications";

// POST /api/email/welcome — Send welcome email after registration
export async function POST(request: NextRequest) {
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
      from: FROM_EMAIL,
      to: [email],
      subject: "Vítejte v SimCall! 🎉",
      react: WelcomeEmail({ fullName: fullName || "uživateli", planName: planName || "Demo" }),
    });

    if (error) {
      console.error("[email/welcome] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[email/welcome] Sent to ${email}, id=${data?.id}`);
    notifyNewRegistration(email, fullName || "");
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[email/welcome] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
