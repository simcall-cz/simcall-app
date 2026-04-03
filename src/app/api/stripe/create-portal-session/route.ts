import { NextRequest, NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

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
    // ----------------------------------------------------------------
    // 1. Authenticate user
    // ----------------------------------------------------------------
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Nepřihlášený uživatel" },
        { status: 401 },
      );
    }

    // ----------------------------------------------------------------
    // 2. Look up active subscription to get stripe_customer_id
    // ----------------------------------------------------------------
    const db = createServerClient();

    const { data: subscription } = await db
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .in("status", ["active", "past_due", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!subscription || !subscription.stripe_customer_id) {
      return NextResponse.json(
        { error: "Nebyl nalezen žádný aktivní předplatné" },
        { status: 404 },
      );
    }

    // ----------------------------------------------------------------
    // 3. Create portal session
    // ----------------------------------------------------------------
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const returnUrl = `${origin}/dashboard`;

    const session = await createPortalSession(
      subscription.stripe_customer_id,
      returnUrl,
    );

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[create-portal-session] Error:", error);
    return NextResponse.json({ error: "Interní chyba serveru" }, { status: 500 });
  }
}
