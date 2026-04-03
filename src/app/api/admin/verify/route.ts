import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

// GET /api/admin/verify - Check if the authenticated user is an admin
export async function GET(request: NextRequest) {
  try {
    const { isAdmin, user } = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { isAdmin: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ isAdmin });
  } catch (err) {
    console.error("GET /api/admin/verify error:", err);
    return NextResponse.json(
      { isAdmin: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
