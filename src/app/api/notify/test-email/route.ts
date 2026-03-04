import { NextResponse } from "next/server";
import { getResend, getFromEmail } from "@/lib/resend";
import InvoiceOrderEmail from "@/emails/InvoiceOrderEmail";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "simcallcz@gmail.com";

  try {
    const resend = getResend();
    const from = getFromEmail();
    
    console.log("[test-email] Sending from:", from, "to:", email);
    
    const response = await resend.emails.send({
      from,
      to: [email],
      subject: "TEST — Objednávka přijata 📋",
      react: InvoiceOrderEmail({
        customerName: "Test",
        email,
        plan: "team",
        tier: 5000,
        amount: 5000,
      }),
    });

    console.log("[test-email] Response:", response);

    return NextResponse.json({
      success: true,
      from,
      to: email,
      response
    });
  } catch (err) {
    console.error("[test-email] Error:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      from: process.env.RESEND_FROM_EMAIL || "Unknown",
    }, { status: 500 });
  }
}
