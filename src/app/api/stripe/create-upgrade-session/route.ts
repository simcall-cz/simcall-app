import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_PRICES, getStripePriceId, getPlanPrice } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { notifyPlanUpgrade, notifyPlanDowngrade } from "@/lib/notifications";
import { getResend, getFromEmail } from "@/lib/resend";
import UpgradeConfirmationEmail from "@/emails/UpgradeConfirmationEmail";
import DowngradeScheduledEmail from "@/emails/DowngradeScheduledEmail";

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
            // IMPORTANT: We ONLY update subscription after payment succeeds.
            // If payment fails, we do NOT upgrade — user stays on current plan.
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

            // 1. Create a one-time invoice item for the surcharge
            await stripe.invoiceItems.create({
              customer: currentSub.stripe_customer_id,
              amount: surcharge * 100, // Stripe uses smallest currency unit (haléře)
              currency: "czk",
              description: `Doplatek za upgrade: ${currentSub.plan.toUpperCase()} ${currentSub.tier} → ${plan.toUpperCase()} ${tier} (${surcharge.toLocaleString("cs-CZ")} Kč)`,
            });

            // 2. Create and pay the invoice immediately
            const invoice = await stripe.invoices.create({
              customer: currentSub.stripe_customer_id,
              auto_advance: true,
            });

            if (!invoice.id) {
              return NextResponse.json(
                { error: "Nepodařilo se vytvořit fakturu. Kontaktujte podporu." },
                { status: 500 }
              );
            }

            // 3. Pay the invoice — if this fails, the upgrade is CANCELLED
            const paidInvoice = await stripe.invoices.pay(invoice.id);

            if (paidInvoice.status !== "paid") {
              return NextResponse.json(
                { error: "Platba doplatku selhala. Zkontrolujte platební metodu ve Stripe portálu." },
                { status: 402 }
              );
            }

            // ✅ Payment succeeded — NOW update Stripe subscription and DB

            // 4. Update the subscription to new price (no proration, keep billing anchor)
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
                  upgrade: "true",
                },
              }
            );

            // 5. Update local DB
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

            // 6. Update profile role
            const profileRole = plan === "team" ? "team_manager" : plan;
            await db
              .from("profiles")
              .update({ role: profileRole, updated_at: new Date().toISOString() })
              .eq("id", user.id);

            // 7. Log payment record
            try {
              await db.from("payments").insert({
                user_id: user.id,
                user_email: customerEmail,
                user_name: customerName || null,
                plan,
                tier,
                amount: surcharge,
                method: "stripe",
                status: "completed",
                stripe_session_id: invoice.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            } catch (payErr) {
              console.warn("[upgrade] Failed to log payment:", payErr);
            }

            // 8. Send upgrade confirmation email
            try {
              const resend = getResend();
              await resend.emails.send({
                from: getFromEmail(),
                to: [customerEmail],
                subject: "Potvrzení upgradu balíčku SimCall ⬆️",
                react: UpgradeConfirmationEmail({
                  customerName: customerName || "zákazníku",
                  previousPlan: currentSub.plan,
                  previousTier: currentSub.tier,
                  newPlan: plan,
                  newTier: tier,
                  surcharge,
                }),
              });
            } catch (emailErr) {
              console.warn("[upgrade] Failed to send confirmation email:", emailErr);
            }

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
            // User keeps current plan until period ends, then switches.
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
