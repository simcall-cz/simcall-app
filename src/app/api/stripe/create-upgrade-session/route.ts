import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_PRICES, getStripePriceId, getPlanPrice } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { notifyPlanUpgrade, notifyPlanDowngrade } from "@/lib/notifications";

// POST /api/stripe/create-upgrade-session
// Handles plan changes:
//   - Upgrade (higher tier): immediate change with proration
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
            // UPGRADE: Immediate change with proration
            // User pays the difference for remaining days right away
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

            // Update local DB immediately
            await db
              .from("subscriptions")
              .update({
                plan,
                tier,
                calls_limit: tier,
                agents_limit: priceInfo.agents,
                updated_at: new Date().toISOString(),
              })
              .eq("id", currentSub.id);

            // Update profile role
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
              message: "Plán byl úspěšně upgradován",
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
                  calls_limit: tier.toString(),
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
                scheduled_calls_limit: tier,
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
