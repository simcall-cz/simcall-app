import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_PRICES, getStripePriceId, getPlanPrice } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { notifyPlanUpgrade, notifyPlanDowngrade } from "@/lib/notifications";

// POST /api/stripe/create-upgrade-session
// Handles plan changes:
//   - Upgrade (higher tier): immediate change + fixed one-time surcharge (price difference)
//   - Downgrade (lower tier): scheduled at end of current billing period
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
            // UPGRADE: Fixed surcharge + immediate plan change
            // User pays the FULL price difference as a one-time charge.
            // Billing day stays the same (billing_cycle_anchor: unchanged).
            // From next cycle, they pay the new full price.
            //
            // Example: 1000min (9990) → 2000min (19990) = surcharge 10000 CZK
            // ============================================================

            const surcharge = targetPrice - currentPrice; // in CZK (halíře × 100)

            // 1. Create a one-time invoice item for the surcharge
            if (surcharge > 0 && currentSub.stripe_customer_id) {
              await stripe.invoiceItems.create({
                customer: currentSub.stripe_customer_id,
                amount: surcharge * 100, // Stripe uses smallest currency unit (haléře)
                currency: "czk",
                description: `Doplatek za upgrade: ${currentSub.plan.toUpperCase()} ${currentSub.tier} → ${plan.toUpperCase()} ${tier} (${surcharge.toLocaleString("cs-CZ")} Kč)`,
              });

              // 2. Create and pay the invoice immediately
              const invoice = await stripe.invoices.create({
                customer: currentSub.stripe_customer_id,
                auto_advance: true, // Auto-finalize
              });

              if (invoice.id) {
                await stripe.invoices.pay(invoice.id);
              }
            }

            // 3. Update the subscription to new price (no proration, keep billing anchor)
            await stripe.subscriptions.update(
              currentSub.stripe_subscription_id,
              {
                items: [
                  {
                    id: stripeSub.items.data[0].id,
                    price: stripePriceId,
                  },
                ],
                proration_behavior: "none", // No automatic proration — we handle it manually
                billing_cycle_anchor: "unchanged", // Keep the same billing day
                metadata: {
                  plan,
                  tier: tier.toString(),
                  minutes_limit: tier.toString(),
                  agents_limit: priceInfo.agents.toString(),
                  user_id: user.id,
                  upgrade: "true",
                },
              }
            );

            // 4. Update local DB immediately
            await db
              .from("subscriptions")
              .update({
                plan,
                tier,
                minutes_limit: tier,
                agents_limit: priceInfo.agents,
                updated_at: new Date().toISOString(),
              })
              .eq("id", currentSub.id);

            // 5. Update profile role
            const profileRole = plan === "team" ? "team_manager" : plan;
            await db
              .from("profiles")
              .update({ role: profileRole, updated_at: new Date().toISOString() })
              .eq("id", user.id);

            // Discord notification
            notifyPlanUpgrade(
              customerEmail,
              currentSub.plan, currentSub.tier,
              plan, tier
            );

            return NextResponse.json({
              success: true,
              upgraded: true,
              surcharge,
              message: `Plán byl úspěšně upgradován. Doplatek: ${surcharge.toLocaleString("cs-CZ")} Kč`,
            });

          } else {
            // ============================================================
            // DOWNGRADE: Schedule change at end of current billing period
            // User keeps current plan until period ends, then switches
            // ============================================================
            await stripe.subscriptions.update(
              currentSub.stripe_subscription_id,
              {
                items: [
                  {
                    id: stripeSub.items.data[0].id,
                    price: stripePriceId,
                  },
                ],
                proration_behavior: "none",
                billing_cycle_anchor: "unchanged",
                metadata: {
                  plan,
                  tier: tier.toString(),
                  minutes_limit: tier.toString(),
                  agents_limit: priceInfo.agents.toString(),
                  user_id: user.id,
                  downgrade: "true",
                  scheduled_plan: plan,
                  scheduled_tier: tier.toString(),
                },
              }
            );

            // Store the scheduled downgrade in DB
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
            const subData = stripeSub as any;
            const periodEnd = subData.current_period_end
              ? new Date(subData.current_period_end * 1000).toLocaleDateString("cs-CZ")
              : "konce období";

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
        console.warn("[upgrade] Direct subscription update failed, falling back to new checkout:", err);
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
