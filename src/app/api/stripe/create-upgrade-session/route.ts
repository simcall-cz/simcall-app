import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_PRICES, getStripePriceId, getPlanPrice } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { notifyPlanDowngrade } from "@/lib/notifications";
import { getResend, getFromEmail } from "@/lib/resend";
import DowngradeScheduledEmail from "@/emails/DowngradeScheduledEmail";

// POST /api/stripe/create-upgrade-session
// Handles plan changes:
//   - Upgrade (higher tier): redirect to Stripe Checkout to pay the fixed price difference
//   - Downgrade (lower tier): scheduled at end of current billing period (DB only)
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

    // Determine if this is an upgrade or downgrade
    const currentPrice = currentSub
      ? (PLAN_PRICES[currentSub.plan]?.[currentSub.tier]?.price || 0)
      : 0;
    const targetPrice = priceInfo.price;
    const isUpgrade = targetPrice > currentPrice;

    // If user already has a Stripe subscription, handle via Stripe API
    if (currentSub?.stripe_subscription_id) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(
          currentSub.stripe_subscription_id
        );

        if (stripeSub && stripeSub.status === "active") {
          if (isUpgrade) {
            // ============================================================
            // UPGRADE: Redirect to Stripe Checkout to pay the surcharge
            // After payment is confirmed via webhook, the subscription
            // will be updated to the new plan/tier.
            // ============================================================

            const surcharge = targetPrice - currentPrice; // in CZK

            if (!currentSub.stripe_customer_id) {
              return NextResponse.json(
                { error: "Chybí Stripe zákazník. Kontaktujte podporu." },
                { status: 400 }
              );
            }

            if (surcharge <= 0) {
              return NextResponse.json(
                { error: "Neplatný doplatek." },
                { status: 400 }
              );
            }

            const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

            // Create a Checkout Session in payment mode for the surcharge
            const checkoutSession = await stripe.checkout.sessions.create({
              mode: "payment",
              customer: currentSub.stripe_customer_id,
              line_items: [
                {
                  price_data: {
                    currency: "czk",
                    unit_amount: surcharge * 100, // haléře
                    product_data: {
                      name: `Doplatek za upgrade: ${currentSub.plan.toUpperCase()} ${currentSub.tier} → ${plan.toUpperCase()} ${tier}`,
                      description: `Jednorázový doplatek ${surcharge.toLocaleString("cs-CZ")} Kč za navýšení balíčku`,
                    },
                  },
                  quantity: 1,
                },
              ],
              metadata: {
                type: "upgrade_surcharge",
                user_id: user.id,
                plan,
                tier: tier.toString(),
                minutes_limit: tier.toString(),
                agents_limit: priceInfo.agents.toString(),
                previous_plan: currentSub.plan,
                previous_tier: currentSub.tier.toString(),
                stripe_subscription_id: currentSub.stripe_subscription_id,
                stripe_price_id: stripePriceId,
                surcharge: surcharge.toString(),
                customer_name: customerName,
                customer_email: customerEmail,
                subscription_id: currentSub.id,
              },
              success_url: `${origin}/dashboard/balicek?upgraded=true`,
              cancel_url: `${origin}/dashboard/balicek`,
              locale: "cs",
            });

            return NextResponse.json({
              url: checkoutSession.url,
            });

          } else {
            // ============================================================
            // DOWNGRADE: Schedule change at end of current billing period
            // We do NOT change Stripe subscription items now — that happens
            // in the invoice.payment_succeeded webhook when the scheduled
            // downgrade is applied.
            // ============================================================

            // Store the scheduled downgrade in DB only
            await db
              .from("subscriptions")
              .update({
                scheduled_plan: plan,
                scheduled_tier: tier,
                scheduled_minutes_limit: tier,
                scheduled_agents_limit: priceInfo.agents,
                updated_at: new Date().toISOString(),
              })
              .eq("id", currentSub.id);

            // Calculate when the downgrade takes effect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subData = stripeSub as any;
            const periodEndDate = subData.current_period_end
              ? new Date(subData.current_period_end * 1000)
              : null;
            const periodEnd = periodEndDate
              ? periodEndDate.toLocaleDateString("cs-CZ")
              : "konce období";

            // Send downgrade scheduled email
            try {
              const resend = getResend();
              await resend.emails.send({
                from: getFromEmail(),
                to: [customerEmail],
                subject: "Změna balíčku SimCall naplánována ⬇️",
                react: DowngradeScheduledEmail({
                  customerName: customerName || "zákazníku",
                  currentPlan: currentSub.plan,
                  currentTier: currentSub.tier,
                  newPlan: plan,
                  newTier: tier,
                  effectiveDate: periodEnd,
                }),
              });
            } catch (emailErr) {
              console.warn("[downgrade] Failed to send scheduled email:", emailErr);
            }

            // Discord notification
            notifyPlanDowngrade(
              customerEmail,
              currentSub.plan, currentSub.tier,
              plan, tier
            );

            return NextResponse.json({
              success: true,
              scheduled: true,
              message: `Downgrade na ${plan.toUpperCase()} ${tier} bude aktivován ${periodEnd}. Do té doby budete mít aktuální balíček.`,
            });
          }
        }
      } catch (err) {
        console.error("[upgrade] Stripe operation failed:", err);
        const errMsg = err instanceof Error ? err.message : "Stripe operace selhala";
        return NextResponse.json(
          { error: `Nepodařilo se provést změnu plánu: ${errMsg}` },
          { status: 500 }
        );
      }
    }

    // Fallback: Create a new checkout session (user has no Stripe subscription)
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      metadata: {
        plan,
        tier: tier.toString(),
        minutes_limit: tier.toString(),
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
