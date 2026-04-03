import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

// POST /api/stripe/cancel-downgrade
// Cancels a scheduled downgrade by clearing the 'scheduled_*' fields in the database
// Since our downgrade logic only stores intent in the DB and doesn't modify Stripe
// until the billing period ends, we only need to clear the DB fields.
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient();

    // Find the active subscription
    const { data: currentSub } = await db
      .from("subscriptions")
      .select("id, scheduled_plan")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!currentSub || !currentSub.scheduled_plan) {
      return NextResponse.json(
        { error: "Nebyla nalezena žádná plánovaná změna balíčku." },
        { status: 404 }
      );
    }

    // Clear the scheduled fields in the database
    const { error } = await db
      .from("subscriptions")
      .update({
        scheduled_plan: null,
        scheduled_tier: null,
        scheduled_minutes_limit: null,
        scheduled_agents_limit: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentSub.id);

    if (error) {
      console.error("[cancel-downgrade] DB error:", error);
      return NextResponse.json(
        { error: "Nepodařilo se zrušit naplánovanou změnu." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Plánovaná změna byla úspěšně zrušena." });
  } catch (error: unknown) {
    console.error("[cancel-downgrade] Error:", error);
    return NextResponse.json({ error: "Interní chyba serveru" }, { status: 500 });
  }
}
