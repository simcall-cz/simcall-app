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
// Price mapping: plan + tier → price in CZK + agents limit
// All prices INCLUDE DPH (VAT)
// ============================================================

export const PLAN_PRICES: Record<string, Record<number, { price: number; agents: number }>> = {
  solo: {
    100: { price: 990, agents: 10 },
    250: { price: 2490, agents: 25 },
    500: { price: 4990, agents: 50 },
    1000: { price: 9990, agents: 100 },
  },
  team: {
    500: { price: 7490, agents: 50 },
    1000: { price: 14990, agents: 100 },
    2500: { price: 37490, agents: 250 },
    5000: { price: 74990, agents: 500 },
  },
};

// ============================================================
// Stripe Price ID mapping from environment variables
// Set these in Vercel / .env.local:
//   STRIPE_PRICE_SOLO_50=price_xxx
//   STRIPE_PRICE_SOLO_100=price_xxx
//   ...etc
// ============================================================

export function getStripePriceId(plan: string, tier: number): string | null {
  const envKey = `STRIPE_PRICE_${plan.toUpperCase()}_${tier}`;
  return process.env[envKey] || null;
}

/**
 * Get all configured Stripe price IDs (for debugging)
 */
export function getAllConfiguredPrices(): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const [plan, tiers] of Object.entries(PLAN_PRICES)) {
    for (const tier of Object.keys(tiers)) {
      const key = `${plan}_${tier}`;
      result[key] = getStripePriceId(plan, parseInt(tier));
    }
  }
  return result;
}

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
// Uses real Stripe Price IDs from env vars
// ============================================================

interface CreateCheckoutParams {
  plan: string;
  tier: number;
  customerEmail: string;
  customerName: string;
  userId?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const stripe = getStripe();
  const planPrice = getPlanPrice(params.plan, params.tier);

  if (!planPrice) {
    throw new Error(`Invalid plan/tier: ${params.plan}/${params.tier}`);
  }

  // Get real Stripe price ID from env
  const stripePriceId = getStripePriceId(params.plan, params.tier);

  if (!stripePriceId) {
    throw new Error(
      `Stripe price ID not configured for ${params.plan}/${params.tier}. ` +
      `Set STRIPE_PRICE_${params.plan.toUpperCase()}_${params.tier} in environment variables.`
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: params.customerEmail,
    line_items: [
      {
        price: stripePriceId,
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
      customer_email: params.customerEmail,
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
