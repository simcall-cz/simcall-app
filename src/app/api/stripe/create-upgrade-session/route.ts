import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_PRICES, getStripePriceId, getPlanPrice } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

// POST /api/stripe/create-upgrade-session
// Creates a new Stripe Checkout session for plan upgrade
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Platební systém není nakonfigurován" },
      { status: 503 }
    );
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, tier } = body as { plan: string; tier: number };

    if (!plan || !tier) {
      return NextResponse.json(
        { error: "Chybí plan nebo tier" },
        { status: 400 }
      );
    }

    // Validate that the target plan/tier exists
    const priceInfo = getPlanPrice(plan, tier);
    if (!priceInfo) {
      return NextResponse.json(
        { error: `Neplatná kombinace: ${plan}/${tier}` },
        { status: 400 }
      );
    }

    const stripePriceId = getStripePriceId(plan, tier);
    if (!stripePriceId) {
      return NextResponse.json(
        { error: `Cena není nakonfigurována pro ${plan}/${tier}` },
        { status: 400 }
      );
    }

    const db = createServerClient();
    const stripe = getStripe();

    // Get user's current subscription
    const { data: currentSub } = await db
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get user profile
    const { data: profile } = await db
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const customerEmail = profile?.email || user.email || "";
    const customerName = profile?.full_name || "";

    // If user already has a Stripe subscription, try to upgrade it directly
    if (currentSub?.stripe_subscription_id) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(
          currentSub.stripe_subscription_id
        );

        if (stripeSub && stripeSub.status === "active") {
          // Update the subscription item with the new price (prorate)
          const updatedSub = await stripe.subscriptions.update(
            currentSub.stripe_subscription_id,
            {
              items: [
                {
                  id: stripeSub.items.data[0].id,
                  price: stripePriceId,
                },
              ],
              proration_behavior: "create_prorations",
              metadata: {
                plan,
                tier: tier.toString(),
                calls_limit: tier.toString(),
                agents_limit: priceInfo.agents.toString(),
                user_id: user.id,
                upgrade: "true",
              },
            }
          );

          // Update local DB subscription
          const tierConfig = PLAN_PRICES[plan]?.[tier];
          if (tierConfig) {
            await db
              .from("subscriptions")
              .update({
                plan,
                tier,
                calls_limit: tier,
                agents_limit: tierConfig.agents,
                updated_at: new Date().toISOString(),
              })
              .eq("id", currentSub.id);
          }

          // Update profile role
          const profileRole = plan === "team" ? "team_manager" : plan;
          await db
            .from("profiles")
            .update({ role: profileRole, updated_at: new Date().toISOString() })
            .eq("id", user.id);

          return NextResponse.json({
            success: true,
            upgraded: true,
            message: "Plán byl úspěšně upgradován",
          });
        }
      } catch (err) {
        console.warn("[upgrade] Direct subscription update failed, falling back to new checkout:", err);
      }
    }

    // Fallback: Create a new checkout session with upgrade metadata
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      metadata: {
        plan,
        tier: tier.toString(),
        calls_limit: tier.toString(),
        agents_limit: priceInfo.agents.toString(),
        user_id: user.id,
        customer_name: customerName,
        customer_email: customerEmail,
        upgrade: "true",
        previous_plan: currentSub?.plan || "",
        previous_tier: currentSub?.tier?.toString() || "",
      },
      success_url: `${origin}/dekujeme?session_id={CHECKOUT_SESSION_ID}&upgrade=true`,
      cancel_url: `${origin}/dashboard/balicek`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      locale: "cs",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[create-upgrade-session] Error:", error);
    const message = error instanceof Error ? error.message : "Interní chyba serveru";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
