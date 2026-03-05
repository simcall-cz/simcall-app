import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { notifyBusiness, NotifyColors } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestedPlan, requestedTier, isDowngrade } = body;

    if (!requestedPlan || !requestedTier) {
      return NextResponse.json({ error: "Missing requested plan/tier" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get current subscription
    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .single();

    if (subError || !sub) {
      return NextResponse.json({ error: "Active subscription not found" }, { status: 404 });
    }

    if (sub.billing_method !== "invoice") {
      return NextResponse.json({ error: "Not an invoice customer" }, { status: 400 });
    }

    // Handle Downgrade
    if (isDowngrade) {
      const { error: scheduleError } = await supabase
        .from("subscriptions")
        .update({
          scheduled_plan: requestedPlan,
          scheduled_tier: requestedTier,
          updated_at: new Date().toISOString()
        })
        .eq("id", sub.id);

      if (scheduleError) {
        console.error("Schedule downgrade error:", scheduleError);
        return NextResponse.json({ error: scheduleError.message }, { status: 500 });
      }

      // Notify on Discord
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", user.id)
        .single();
        
      const customerEmail = profile?.email || user.email;
      const customerName = profile?.full_name || "Bez jména";

      await notifyBusiness({
        title: "⬇️ Automatický downgrade naplánován (Faktura)",
        color: NotifyColors.WARNING,
        fields: [
          { name: "Zákazník", value: `${customerName} (${customerEmail})`, inline: false },
          { name: "Aktuální", value: `${sub.plan.toUpperCase()} ${sub.tier}`, inline: true },
          { name: "Nový", value: `${requestedPlan.toUpperCase()} ${requestedTier}`, inline: true },
        ],
        description: "Zákazník napojený na fakturu si sám naplánoval snížení tarifu. Změna se automaticky aplikuje na konci aktuálního zúčtovacího období bez nutnosti schválení.",
      });

      return NextResponse.json({ success: true, message: "Downgrade scheduled" });
    }

    // Handle Upgrade (requires approval)
    const { error: insertError } = await supabase
      .from("invoice_requests")
      .insert({
        user_id: user.id,
        current_plan: sub.plan,
        current_tier: sub.tier,
        requested_plan: requestedPlan,
        requested_tier: requestedTier,
      });

    if (insertError) {
      console.error("Insert invoice request error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Notify on Discord
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const customerEmail = profile?.email || user.email;
    const customerName = profile?.full_name || "Bez jména";

    await notifyBusiness({
      title: "⬆️ Žádost o zvýšení tarifu (Faktura)",
      color: NotifyColors.PURPLE,
      fields: [
        { name: "Zákazník", value: `${customerName} (${customerEmail})`, inline: false },
        { name: "Aktuální", value: `${sub.plan.toUpperCase()} ${sub.tier}`, inline: true },
        { name: "Požadovaný", value: `${requestedPlan.toUpperCase()} ${requestedTier}`, inline: true },
      ],
      description: "Zákazník napojený na fakturu žádá o navýšení tarifu. Administrátor musí vyčkat na příchod úhrady a následně změnu schválit v administraci faktur.",
    });

    return NextResponse.json({ success: true, message: "Request queued for approval" });
  } catch (err) {
    console.error("POST /api/invoice-request error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
