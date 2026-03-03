import Stripe from "stripe";

// ============================================================
// Stripe client (server-side only)
// ============================================================

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set. Add it to your .env file.");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// ============================================================
// Price mapping: plan + tier → price in CZK
// All prices INCLUDE DPH (VAT)
// ============================================================

export const PLAN_PRICES: Record<string, Record<number, { price: number; agents: number }>> = {
  solo: {
    50: { price: 490, agents: 5 },
    100: { price: 990, agents: 10 },
    250: { price: 1990, agents: 25 },
    500: { price: 3490, agents: 50 },
    1000: { price: 4990, agents: 100 },
  },
  team: {
    250: { price: 2490, agents: 25 },
    500: { price: 4490, agents: 50 },
    1000: { price: 7990, agents: 100 },
    2500: { price: 14990, agents: 250 },
    5000: { price: 24990, agents: 500 },
  },
};

/**
 * Get price details for a plan + tier combo
 */
export function getPlanPrice(plan: string, tier: number) {
  return PLAN_PRICES[plan]?.[tier] || null;
}

/**
 * Get the display name for a plan
 */
export function getPlanDisplayName(plan: string, tier: number): string {
  const name = plan === "solo" ? "Solo" : plan === "team" ? "Team" : plan;
  return `${name} ${tier}`;
}

// ============================================================
// Stripe Checkout Session creation
// ============================================================

interface CreateCheckoutParams {
  plan: string;
  tier: number;
  customerEmail: string;
  customerName: string;
  userId?: string; // if user already has account
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const stripe = getStripe();
  const planPrice = getPlanPrice(params.plan, params.tier);

  if (!planPrice) {
    throw new Error(`Invalid plan/tier: ${params.plan}/${params.tier}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "czk",
          product_data: {
            name: `SimCall ${getPlanDisplayName(params.plan, params.tier)}`,
            description: `${params.tier} hovorů/měsíc, ${planPrice.agents} AI agentů`,
          },
          unit_amount: planPrice.price * 100, // Stripe uses smallest currency unit (haléře)
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: params.plan,
      tier: params.tier.toString(),
      calls_limit: params.tier.toString(),
      agents_limit: planPrice.agents.toString(),
      user_id: params.userId || "",
      customer_name: params.customerName,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    locale: "cs",
  });

  return session;
}

// ============================================================
// Stripe Customer Portal
// ============================================================

export async function createPortalSession(customerId: string, returnUrl: string) {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
