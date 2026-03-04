import { NextRequest, NextResponse } from "next/server";
import { notifyNewRegistration } from "@/lib/notifications";

// POST /api/notify/registration — Notify about new user registration
export async function POST(request: NextRequest) {
  try {
    const { email, name } = (await request.json()) as {
      email: string;
      name: string;
    };

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    await notifyNewRegistration(email, name || "");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[notify/registration] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
