import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/payments - List all payments
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = createServerClient();

    try {
      const { data: payments, error } = await db
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Payments query error:", error.message);
        return NextResponse.json({ payments: [] });
      }

      // Format payments to normalize Stripe vs Invoice metadata
      const formattedPayments = (payments || []).map((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metadata = p.metadata || ({} as any);
        return {
          ...p,
          plan: p.plan || metadata.plan || "Neznámý",
          tier: p.tier || metadata.tier || 0,
          method: p.method || metadata.billing_method || "stripe",
        };
      });

      return NextResponse.json({ payments: formattedPayments });
    } catch {
      return NextResponse.json({ payments: [] });
    }
  } catch (err) {
    console.error("GET /api/admin/payments error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

