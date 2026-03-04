import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { notifyInvoiceOrder } from "@/lib/notifications";

// POST /api/payments/create - Create a pending payment (for invoice orders)
export async function POST(request: NextRequest) {
  try {
    const db = createServerClient();
    const body = await request.json();
    const { plan, tier, amount, email, name, userId } = body;

    if (!plan || !tier || !amount || !email) {
      return NextResponse.json(
        { error: "plan, tier, amount and email are required" },
        { status: 400 }
      );
    }

    const { data: payment, error } = await db
      .from("payments")
      .insert({
        user_id: userId || null,
        user_email: email,
        user_name: name || null,
        plan,
        tier,
        amount,
        method: "invoice",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Create payment error:", error);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }

    // Discord notification
    notifyInvoiceOrder(email, name || "", plan, tier, amount);

    return NextResponse.json({ payment });
  } catch (err) {
    console.error("POST /api/payments/create error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
