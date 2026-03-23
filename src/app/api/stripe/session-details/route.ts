import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// GET /api/stripe/session-details?session_id=cs_xxx
// Returns plan details from a completed Stripe Checkout Session
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id parameter" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = session.metadata || {};

    const plan = metadata.plan || "solo";
    const tier = parseInt(metadata.tier || "0", 10);
    const minutesLimit = parseInt(metadata.minutes_limit || "0", 10);
    const customerEmail = metadata.customer_email || session.customer_email || session.customer_details?.email || "";
    const customerName = metadata.customer_name || "";
    const isUpgrade = metadata.upgrade === "true";

    // Determine plan display name
    const planName = plan === "team" ? "Team" : "Solo";
    const displayName = `${planName} ${minutesLimit || tier}`;

    return NextResponse.json({
      plan,
      tier,
      minutesLimit: minutesLimit || tier,
      customerEmail,
      customerName,
      displayName,
      isUpgrade,
      status: session.payment_status,
    });
  } catch (error: unknown) {
    console.error("[session-details] Error:", error);
    const message = error instanceof Error ? error.message : "Nepodařilo se načíst detaily session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
