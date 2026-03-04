import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/subscriptions - List all subscriptions (admin only)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();

    try {
      const { data: subscriptions, error } = await db
        .from("subscriptions")
        .select(
          "id, user_id, plan, tier, status, calls_used, calls_limit, agents_limit, stripe_customer_id, stripe_subscription_id, customer_name, customer_email, current_period_start, current_period_end, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        // Table may not exist — return empty
        console.warn("Subscriptions query error (table may not exist):", error.message);
        return NextResponse.json({ subscriptions: [] });
      }

      // Enrich subscriptions with profile data for missing names
      const enriched = await Promise.all(
        (subscriptions || []).map(async (sub) => {
          if (!sub.customer_name && sub.user_id) {
            const { data: profile } = await db
              .from("profiles")
              .select("full_name, email")
              .eq("id", sub.user_id)
              .single();
            if (profile) {
              return {
                ...sub,
                customer_name: profile.full_name || null,
                customer_email: sub.customer_email || profile.email || null,
              };
            }
          }
          return sub;
        })
      );

      return NextResponse.json({ subscriptions: enriched });
    } catch {
      return NextResponse.json({ subscriptions: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/subscriptions error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/subscriptions - Update subscription status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();
    const body = await request.json();
    const { subscriptionId, status, calls_used } = body as {
      subscriptionId: string;
      status?: string;
      calls_used?: number;
    };

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }
    if (typeof calls_used === "number") {
      updateData.calls_used = calls_used;
    }

    const { error } = await db
      .from("subscriptions")
      .update(updateData)
      .eq("id", subscriptionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If deactivating, also reset user profile
    if (status === "cancelled") {
      const { data: sub } = await db
        .from("subscriptions")
        .select("user_id")
        .eq("id", subscriptionId)
        .single();

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
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/subscriptions error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
