import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { notifyBusiness, NotifyColors } from "@/lib/notifications";

// GET /api/cron/check-expirations
// This should be called daily by Vercel Cron or a similar service.
export async function GET(request: Request) {
  try {
    // Optionally check a cron auth header from env to prevent public execution
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient();
    const today = new Date();
    
    // Find active invoice subscriptions that have expired
    const { data: expiredSubs, error } = await db
      .from("subscriptions")
      .select("*")
      .eq("billing_method", "invoice")
      .eq("status", "active")
      .lt("current_period_end", today.toISOString());

    if (error) {
      console.error("Cron check-expirations error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!expiredSubs || expiredSubs.length === 0) {
      return NextResponse.json({ message: "No expired subscriptions found." });
    }

    const cancelledIds: string[] = [];
    const notifications: { name: string; email: string; daysOverdue: number; plan: string; tier: number }[] = [];

    for (const sub of expiredSubs) {
      const expirationDate = new Date(sub.current_period_end);
      const diffTime = Math.abs(today.getTime() - expirationDate.getTime());
      const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // 10-day grace period
      if (daysOverdue > 10) {
        // Cancel subscription
        const { error: cancelError } = await db
          .from("subscriptions")
          .update({
            status: "cancelled",
            updated_at: today.toISOString()
          })
          .eq("id", sub.id);
          
        if (cancelError) {
          console.error(`Failed to cancel sub ${sub.id}`, cancelError);
          continue;
        }

        // Downgrade profile to free
        await db
          .from("profiles")
          .update({
            role: "free",
            updated_at: today.toISOString()
          })
          .eq("id", sub.user_id);

        cancelledIds.push(sub.id);
        notifications.push({
          name: sub.customer_name || "Neznámý",
          email: sub.customer_email || "Neznámý",
          daysOverdue,
          plan: sub.plan,
          tier: sub.tier,
        });
      }
    }

    // Send Discord notification for batch cancellations
    if (notifications.length > 0) {
      const description = notifications.map(n => 
        `- **${n.name}** (${n.email}): Tarif ${n.plan.toUpperCase()} ${n.tier} zrušen (Po splatnosti ${n.daysOverdue} dní)`
      ).join("\\n");

      await notifyBusiness({
        title: "⛔ Expirace Fakturačních Tarifů",
        color: NotifyColors.ERROR,
        fields: [
          { name: "Pocet zrušených", value: notifications.length.toString(), inline: false }
        ],
        description: `Během denní kontroly byly nalezeny tarify více než 10 dní po splatnosti a byly **automaticky zrušeny**:\\n\\n${description}`
      });
    }

    return NextResponse.json({ processed: expiredSubs.length, cancelled: cancelledIds.length });
  } catch (err) {
    console.error("Cron runtime error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
