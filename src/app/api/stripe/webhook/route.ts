import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { getResend, getFromEmail } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import AccountCreatedEmail from "@/emails/AccountCreatedEmail";
import {
  notifyPaymentCompleted,
  notifyAutoAccountCreated,
  notifySubscriptionCancelled,
  notifyPaymentFailed,
  notifyRebill,
} from "@/lib/notifications";

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
        const minutesLimit = parseInt(metadata.minutes_limit || "0", 10);
        const agentsLimit = parseInt(metadata.agents_limit || "0", 10);
        let userId = metadata.user_id || null;
        const customerName = metadata.customer_name || "";
        const customerEmail = metadata.customer_email || session.customer_email || session.customer_details?.email || "";

        // If no user_id in metadata, try to find user by email
        let accountAutoCreated = false;
        let temporaryPassword = "";

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
          } else {
            // ============================================================
            // AUTO-CREATE ACCOUNT for users who paid without registering
            // ============================================================
            try {
              // Generate a random 12-character password
              temporaryPassword = Array.from(
                { length: 12 },
                () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'[
                  Math.floor(Math.random() * 59)
                ]
              ).join('');

              const { data: newUser, error: createError } = await db.auth.admin.createUser({
                email: customerEmail.toLowerCase(),
                password: temporaryPassword,
                email_confirm: true, // auto-confirm email
                user_metadata: {
                  full_name: customerName || customerEmail.split('@')[0],
                  role: plan === 'team' ? 'team_manager' : plan,
                },
              });

              if (createError || !newUser?.user) {
                console.error('[stripe/webhook] Failed to auto-create user:', createError);
              } else {
                userId = newUser.user.id;
                accountAutoCreated = true;

                // Create profile record
                await db
                  .from('profiles')
                  .insert({
                    id: userId,
                    email: customerEmail.toLowerCase(),
                    full_name: customerName || customerEmail.split('@')[0],
                    role: plan === 'team' ? 'team_manager' : plan,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });

                console.log(`[stripe/webhook] Auto-created account for ${customerEmail} → ${userId}`);
              }
            } catch (autoCreateErr) {
              console.error('[stripe/webhook] Auto-create account error:', autoCreateErr);
            }
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
                minutes_limit: minutesLimit,
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
                minutes_limit: minutesLimit,
                seconds_used: 0,
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
              minutes_limit: minutesLimit,
              seconds_used: 0,
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

        // Send appropriate email
        const orderEmail = session.customer_email || session.customer_details?.email;
        if (orderEmail) {
          const resend = getResend();

          if (accountAutoCreated && temporaryPassword) {
            // Send account-created email with credentials
            await resend.emails.send({
              from: getFromEmail(),
              to: [orderEmail],
              subject: "Váš účet SimCall byl vytvořen — přihlašovací údaje 🔑",
              react: AccountCreatedEmail({
                customerName: customerName || "zákazníku",
                email: orderEmail,
                temporaryPassword,
                plan,
                tier,
                minutesLimit,
              }),
            });
          } else {
            // Send regular order confirmation
            await resend.emails.send({
              from: getFromEmail(),
              to: [orderEmail],
              subject: "Potvrzení objednávky — SimCall ✅",
              react: OrderConfirmationEmail({
                customerName: customerName || "zákazníku",
                plan,
                tier,
                minutesLimit,
                customerEmail: orderEmail,
              }),
            });
          }
        }

        console.log(`[stripe/webhook] checkout.session.completed — plan=${plan} tier=${tier} userId=${userId}`);

        // Business notification
        const amount = session.amount_total ? Math.round(session.amount_total / 100) : 0;
        await notifyPaymentCompleted(customerEmail, plan, tier, amount);
        if (accountAutoCreated) {
          await notifyAutoAccountCreated(customerEmail, customerName, plan, tier);
        }
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
        await notifySubscriptionCancelled(sub?.user_id || "", stripeSubId);
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

          // Reset usage and update period
          await db
            .from("subscriptions")
            .update({
              seconds_used: 0,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", stripeSubId);

          // Check and apply scheduled plan changes (downgrades)
          const { data: subRecord } = await db
            .from("subscriptions")
            .select("id, user_id, scheduled_plan, scheduled_tier, scheduled_minutes_limit, scheduled_agents_limit")
            .eq("stripe_subscription_id", stripeSubId)
            .single();

          if (subRecord?.scheduled_plan && subRecord?.scheduled_tier) {
            // Apply the scheduled downgrade
            await db
              .from("subscriptions")
              .update({
                plan: subRecord.scheduled_plan,
                tier: subRecord.scheduled_tier,
                minutes_limit: subRecord.scheduled_minutes_limit || subRecord.scheduled_tier,
                agents_limit: subRecord.scheduled_agents_limit || 10,
                scheduled_plan: null,
                scheduled_tier: null,
                scheduled_minutes_limit: null,
                scheduled_agents_limit: null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", subRecord.id);

            // Update profile role to match new plan
            if (subRecord.user_id) {
              const newRole = subRecord.scheduled_plan === "team" ? "team_manager" : subRecord.scheduled_plan;
              await db
                .from("profiles")
                .update({ role: newRole, updated_at: new Date().toISOString() })
                .eq("id", subRecord.user_id);
            }

            console.log(`[stripe/webhook] Applied scheduled downgrade: ${subRecord.scheduled_plan}/${subRecord.scheduled_tier} for sub ${subRecord.id}`);
          }

          console.log(`[stripe/webhook] invoice.payment_succeeded — ${stripeSubId} calls reset`);
          await notifyRebill(stripeSubId);
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
          await notifyPaymentFailed("", stripeSubId);
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
