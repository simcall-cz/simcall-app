import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";

// Required for raw body access and consistent behavior
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ====================================================================
// Helpers
// ====================================================================

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

// ====================================================================
// POST /api/stripe/webhook
// ====================================================================

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set");
    return json({ error: "Webhook secret not configured" }, 500);
  }

  // ------------------------------------------------------------------
  // 1. Read raw body & verify signature
  // ------------------------------------------------------------------
  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return json({ error: "Missing stripe-signature header" }, 400);
    }

    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/webhook] Signature verification failed:", message);
    return json({ error: `Webhook signature verification failed: ${message}` }, 400);
  }

  // ------------------------------------------------------------------
  // 2. Handle events
  // ------------------------------------------------------------------
  const db = createServerClient();

  try {
    switch (event.type) {
      // ================================================================
      // checkout.session.completed
      // ================================================================
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        const plan = metadata.plan || "solo";
        const tier = parseInt(metadata.tier || "0", 10);
        const callsLimit = parseInt(metadata.calls_limit || "0", 10);
        const agentsLimit = parseInt(metadata.agents_limit || "0", 10);
        let userId = metadata.user_id || null;
        const customerName = metadata.customer_name || "";
        const customerEmail = metadata.customer_email || session.customer_email || session.customer_details?.email || "";

        // If no user_id in metadata, try to find user by email
        if (!userId && customerEmail) {
          const { data: profile } = await db
            .from("profiles")
            .select("id")
            .eq("email", customerEmail.toLowerCase())
            .limit(1)
            .single();

          if (profile) {
            userId = profile.id;
            console.log(`[stripe/webhook] Found user by email: ${customerEmail} → ${userId}`);
          }
        }

        const isUpgrade = metadata.upgrade === "true";

        if (isUpgrade && userId) {
          // Upgrade: update existing subscription
          const { data: existingSub } = await db
            .from("subscriptions")
            .select("id")
            .eq("user_id", userId)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (existingSub) {
            const { error: updateError } = await db
              .from("subscriptions")
              .update({
                plan,
                tier,
                calls_limit: callsLimit,
                agents_limit: agentsLimit,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingSub.id);

            if (updateError) {
              console.error("[stripe/webhook] Failed to update subscription for upgrade:", updateError);
            } else {
              console.log(`[stripe/webhook] Upgraded subscription ${existingSub.id} to ${plan}/${tier}`);
            }
          } else {
            // No existing sub, create new
            await db
              .from("subscriptions")
              .insert({
                user_id: userId,
                plan,
                tier,
                status: "active",
                calls_limit: callsLimit,
                calls_used: 0,
                agents_limit: agentsLimit,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                current_period_start: new Date().toISOString(),
                current_period_end: null,
              });
          }
        } else {
          // New subscription
          const { data: subscription, error: subError } = await db
            .from("subscriptions")
            .insert({
              user_id: userId || null,
              plan,
              tier,
              status: "active",
              calls_limit: callsLimit,
              calls_used: 0,
              agents_limit: agentsLimit,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              current_period_start: new Date().toISOString(),
              current_period_end: null,
            })
            .select("id")
            .single();

          if (subError) {
            console.error("[stripe/webhook] Failed to create subscription:", subError);
            break;
          }

          if (!subscription) break;
        }

        // If user exists, update their profile role to match the plan
        if (userId) {
          // Team plan buyers become team_manager; solo buyers become solo
          const profileRole = plan === "team" ? "team_manager" : plan;
          await db
            .from("profiles")
            .update({
              role: profileRole,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }

        // Log payment record for admin overview
        try {
          const amountPaid = session.amount_total ? Math.round(session.amount_total / 100) : 0;
          await db
            .from("payments")
            .insert({
              user_id: userId || null,
              user_email: customerEmail,
              user_name: customerName || null,
              plan,
              tier,
              amount: amountPaid,
              method: "stripe",
              status: "completed",
              stripe_session_id: session.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
        } catch (paymentLogErr) {
          // Non-critical — don't break the webhook if payments table doesn't exist yet
          console.warn("[stripe/webhook] Failed to log payment:", paymentLogErr);
        }

        // For team plans, create a company and add the owner as manager
        if (plan === "team" && userId) {
          // Check if user already has a company
          const { data: existingCompany } = await db
            .from("companies")
            .select("id")
            .eq("owner_id", userId)
            .limit(1)
            .single();

          if (!existingCompany) {
            const { data: company } = await db
              .from("companies")
              .insert({
                name: customerName ? `${customerName} – Team` : "Můj tým",
                owner_id: userId,
              })
              .select("id")
              .single();

            if (company) {
              await db.from("company_members").insert({
                company_id: company.id,
                user_id: userId,
                role: "manager",
              });
            }
          }
        }

        // Send order confirmation email
        const orderEmail = session.customer_email || session.customer_details?.email;
        if (orderEmail) {
          const resend = getResend();
          resend.emails.send({
            from: FROM_EMAIL,
            to: [orderEmail],
            subject: "Potvrzení objednávky — SimCall ✅",
            react: OrderConfirmationEmail({
              customerName: customerName || "zákazníku",
              plan,
              tier,
              callsLimit,
              customerEmail: orderEmail,
            }),
          }).catch((err) => console.error("[email] Order confirmation failed:", err));
        }

        console.log(`[stripe/webhook] checkout.session.completed — plan=${plan} tier=${tier} userId=${userId}`);
        break;
      }

      // ================================================================
      // customer.subscription.updated
      // ================================================================
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubId = subscription.id;
        const status = subscription.status; // active, past_due, canceled, etc.

        // Map Stripe status to our status
        const dbStatus =
          status === "active" ? "active" :
          status === "past_due" ? "past_due" :
          status === "canceled" ? "cancelled" :
          status === "trialing" ? "trialing" :
          status;

        await db
          .from("subscriptions")
          .update({
            status: dbStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", stripeSubId);

        console.log(`[stripe/webhook] customer.subscription.updated — ${stripeSubId} → ${dbStatus}`);
        break;
      }

      // ================================================================
      // customer.subscription.deleted
      // ================================================================
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubId = subscription.id;

        // Mark subscription as cancelled
        const { data: sub } = await db
          .from("subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", stripeSubId)
          .select("user_id")
          .single();

        // Reset user's plan role to demo
        if (sub?.user_id) {
          await db
            .from("profiles")
            .update({
              role: "demo",
              subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", sub.user_id);
        }

        console.log(`[stripe/webhook] customer.subscription.deleted — ${stripeSubId}`);
        break;
      }

      // ================================================================
      // invoice.payment_succeeded
      // ================================================================
      case "invoice.payment_succeeded": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const stripeSubId = invoice.subscription as string | null;

        if (stripeSubId) {
          const periodStart = invoice.period_start
            ? new Date((invoice.period_start as number) * 1000).toISOString()
            : null;
          const periodEnd = invoice.period_end
            ? new Date((invoice.period_end as number) * 1000).toISOString()
            : null;

          await db
            .from("subscriptions")
            .update({
              calls_used: 0,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", stripeSubId);

          console.log(`[stripe/webhook] invoice.payment_succeeded — ${stripeSubId} calls reset`);
        }
        break;
      }

      // ================================================================
      // invoice.payment_failed
      // ================================================================
      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const failedInvoice = event.data.object as any;
        const stripeSubId = failedInvoice.subscription as string | null;

        if (stripeSubId) {
          await db
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", stripeSubId);

          console.log(`[stripe/webhook] invoice.payment_failed — ${stripeSubId} → past_due`);
        }
        break;
      }

      // ================================================================
      // Unhandled event types (silently acknowledge)
      // ================================================================
      default:
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error: unknown) {
    console.error(`[stripe/webhook] Error handling ${event.type}:`, error);
    // Return 200 anyway — Stripe will retry on 4xx/5xx and we don't
    // want retries for processing errors (would create duplicate data).
    return json({ received: true, error: "Processing error" });
  }

  return json({ received: true });
}
