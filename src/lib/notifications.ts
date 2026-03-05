// ============================================================
// Business Event Notification Utility
// Sends real-time alerts to Discord webhook for business monitoring
// ============================================================

interface NotifyOptions {
  title: string;
  description?: string;
  color?: number; // Discord embed color (decimal)
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: string;
}

// Color palette for different event types
export const NotifyColors = {
  SUCCESS: 0x22c55e,  // green — payments, completions
  INFO: 0x3b82f6,     // blue — registrations, info
  WARNING: 0xf59e0b,  // amber — downgrades, pending items
  ERROR: 0xef4444,    // red — failures, cancellations
  PURPLE: 0xa855f7,   // purple — upgrades, plan changes
  NEUTRAL: 0x737373,  // gray — general events
} as const;

/**
 * Send a business event notification to Discord
 * Non-blocking — errors are logged but never thrown
 */
export async function notifyBusiness(options: NotifyOptions): Promise<void> {
  // Read env var at CALL TIME, not module load time (important for Vercel serverless)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[notify] DISCORD_WEBHOOK_URL not set, skipping notification:", options.title);
    return;
  }

  try {
    const embed = {
      title: options.title,
      description: options.description || undefined,
      color: options.color || NotifyColors.INFO,
      fields: options.fields || [],
      footer: options.footer
        ? { text: options.footer }
        : { text: `SimCall · ${new Date().toLocaleString("cs-CZ", { timeZone: "Europe/Prague" })}` },
      timestamp: new Date().toISOString(),
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });
  } catch (err) {
    console.warn("[notify] Discord webhook failed:", err);
  }
}

// ============================================================
// Pre-built notification helpers for common events
// ============================================================

/** New user registration */
export function notifyNewRegistration(email: string, name: string) {
  return notifyBusiness({
    title: "👤 Nová registrace",
    color: NotifyColors.INFO,
    fields: [
      { name: "Jméno", value: name || "—", inline: true },
      { name: "E-mail", value: email, inline: true },
    ],
  });
}

/** Auto-created account after payment */
export function notifyAutoAccountCreated(email: string, name: string, plan: string, tier: number) {
  return notifyBusiness({
    title: "🔑 Auto-registrace po platbě",
    color: NotifyColors.PURPLE,
    fields: [
      { name: "E-mail", value: email, inline: true },
      { name: "Jméno", value: name || "—", inline: true },
      { name: "Plán", value: `${plan.toUpperCase()} ${tier}`, inline: true },
    ],
    description: "Zákazník zaplatil bez registrace — účet vytvořen automaticky.",
  });
}

/** Stripe payment completed */
export function notifyPaymentCompleted(email: string, plan: string, tier: number, amount?: number) {
  return notifyBusiness({
    title: "💳 Platba přijata",
    color: NotifyColors.SUCCESS,
    fields: [
      { name: "Zákazník", value: email, inline: true },
      { name: "Plán", value: `${plan.toUpperCase()} ${tier}`, inline: true },
      ...(amount ? [{ name: "Částka", value: `${amount.toLocaleString("cs-CZ")} Kč`, inline: true }] : []),
    ],
  });
}

/** Payment failed */
export function notifyPaymentFailed(email: string, stripeSubId: string) {
  return notifyBusiness({
    title: "❌ Platba selhala",
    color: NotifyColors.ERROR,
    fields: [
      { name: "Zákazník", value: email || "—", inline: true },
      { name: "Subscription", value: stripeSubId || "—", inline: true },
    ],
  });
}

/** Plan upgrade (immediate) */
export function notifyPlanUpgrade(email: string, fromPlan: string, fromTier: number, toPlan: string, toTier: number) {
  return notifyBusiness({
    title: "⬆️ Upgrade plánu",
    color: NotifyColors.PURPLE,
    fields: [
      { name: "Zákazník", value: email, inline: true },
      { name: "Z", value: `${fromPlan.toUpperCase()} ${fromTier}`, inline: true },
      { name: "Na", value: `${toPlan.toUpperCase()} ${toTier}`, inline: true },
    ],
  });
}

/** Plan downgrade (scheduled) */
export function notifyPlanDowngrade(email: string, currentPlan: string, currentTier: number, newPlan: string, newTier: number) {
  return notifyBusiness({
    title: "⬇️ Downgrade naplánován",
    color: NotifyColors.WARNING,
    fields: [
      { name: "Zákazník", value: email, inline: true },
      { name: "Aktuální", value: `${currentPlan.toUpperCase()} ${currentTier}`, inline: true },
      { name: "Nový (od rebillu)", value: `${newPlan.toUpperCase()} ${newTier}`, inline: true },
    ],
  });
}

/** Subscription cancelled */
export function notifySubscriptionCancelled(email: string, stripeSubId: string) {
  return notifyBusiness({
    title: "🚫 Předplatné zrušeno",
    color: NotifyColors.ERROR,
    fields: [
      { name: "Zákazník", value: email || "—", inline: true },
      { name: "Subscription ID", value: stripeSubId, inline: true },
    ],
  });
}


/** Meeting booked */
export function notifyMeetingBooked(name: string, email: string, date: string, time: string) {
  return notifyBusiness({
    title: "📅 Nová schůzka",
    color: NotifyColors.INFO,
    fields: [
      { name: "Klient", value: `${name} (${email})`, inline: false },
      { name: "Datum", value: date, inline: true },
      { name: "Čas", value: time, inline: true },
    ],
  });
}

/** Contact form submitted */
export function notifyContactForm(name: string, email: string, message: string) {
  return notifyBusiness({
    title: "📬 Nový kontaktní formulář",
    color: NotifyColors.INFO,
    fields: [
      { name: "Od", value: `${name} (${email})`, inline: false },
      { name: "Zpráva", value: message.substring(0, 200) + (message.length > 200 ? "..." : ""), inline: false },
    ],
  });
}

/** Support ticket from dashboard */
export function notifySupportTicket(email: string, subject: string, message: string) {
  return notifyBusiness({
    title: "🎫 Nový ticket podpory",
    color: NotifyColors.WARNING,
    fields: [
      { name: "Od", value: email, inline: true },
      { name: "Předmět", value: subject, inline: true },
      { name: "Zpráva", value: message.substring(0, 300) + (message.length > 300 ? "..." : ""), inline: false },
    ],
  });
}

/** Role change */
export function notifyRoleChange(email: string, oldRole: string, newRole: string) {
  return notifyBusiness({
    title: "🔄 Změna role",
    color: NotifyColors.NEUTRAL,
    fields: [
      { name: "Uživatel", value: email, inline: true },
      { name: "Z", value: oldRole, inline: true },
      { name: "Na", value: newRole, inline: true },
    ],
  });
}

/** Monthly rebill */
export function notifyRebill(stripeSubId: string, email?: string) {
  return notifyBusiness({
    title: "🔄 Měsíční obnova",
    color: NotifyColors.SUCCESS,
    fields: [
      { name: "Subscription", value: stripeSubId, inline: true },
      ...(email ? [{ name: "Zákazník", value: email, inline: true }] : []),
    ],
    description: "Hovory resetovány, nové období započato.",
  });
}

/** Checkout started — lead capture (before Stripe payment) */
export function notifyCheckoutStarted(opts: {
  name: string;
  email: string;
  phone?: string;
  plan: string;
  tier: number;
  companyName?: string;
}) {
  return notifyBusiness({
    title: "🛒 Nový lead — checkout zahájen",
    color: NotifyColors.WARNING,
    description: "Zákazník klikl na platbu a byl přesměrován na Stripe. Pokud nezaplatí, lze ho kontaktovat.",
    fields: [
      { name: "Jméno", value: opts.name || "—", inline: true },
      { name: "E-mail", value: opts.email, inline: true },
      { name: "Telefon", value: opts.phone || "—", inline: true },
      { name: "Plán", value: `${opts.plan.toUpperCase()} ${opts.tier}`, inline: true },
      ...(opts.companyName ? [{ name: "Firma", value: opts.companyName, inline: true }] : []),
    ],
  });
}
