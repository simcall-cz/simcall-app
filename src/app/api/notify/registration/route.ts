import { NextRequest, NextResponse } from "next/server";
import { notifyNewRegistration } from "@/lib/notifications";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/notify/registration — Notify about new user registration
export async function POST(request: NextRequest) {
  // Rate limit: max 5 requests per minute per IP
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

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
