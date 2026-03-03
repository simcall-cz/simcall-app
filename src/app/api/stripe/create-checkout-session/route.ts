import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PLAN_PRICES } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // ------------------------------------------------------------------
  // Guard: Stripe must be configured
  // ------------------------------------------------------------------
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Platební systém není nakonfigurován" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { plan, tier, email, name, phone, companyName } = body as {
      plan: "solo" | "team";
      tier: number;
      email: string;
      name: string;
      phone?: string;
      companyName?: string;
    };

    // ----------------------------------------------------------------
    // Validate required fields
    // ----------------------------------------------------------------
    if (!plan || !tier || !email || !name) {
      return NextResponse.json(
        { error: "Chybí povinné údaje (plan, tier, email, name)" },
        { status: 400 },
      );
    }

    // ----------------------------------------------------------------
    // Validate plan + tier combination
    // ----------------------------------------------------------------
    const priceInfo = PLAN_PRICES[plan]?.[tier];
    if (!priceInfo) {
      return NextResponse.json(
        { error: `Neplatná kombinace plánu a tieru: ${plan}/${tier}` },
        { status: 400 },
      );
    }

    // ----------------------------------------------------------------
    // Optionally resolve logged-in user from Authorization header
    // ----------------------------------------------------------------
    let userId: string | undefined;
    const user = await getUserFromRequest(request);
    if (user) {
      userId = user.id;
    }
    // Also accept explicit userId from the body (e.g. pre-auth flow)
    if (!userId && body.userId) {
      userId = body.userId as string;
    }

    // ----------------------------------------------------------------
    // Build URLs
    // ----------------------------------------------------------------
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const successUrl = `${origin}/dekujeme?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout`;

    // ----------------------------------------------------------------
    // Create Stripe Checkout Session
    // ----------------------------------------------------------------
    const session = await createCheckoutSession({
      plan,
      tier,
      customerEmail: email,
      customerName: name,
      userId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[create-checkout-session] Error:", error);
    const message = error instanceof Error ? error.message : "Interní chyba serveru";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
