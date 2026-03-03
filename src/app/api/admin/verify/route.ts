import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, isAdminEmail } from "@/lib/auth";

// GET /api/admin/verify - Check if the authenticated user is an admin
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { isAdmin: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isAdmin = isAdminEmail(user.email || "");

    return NextResponse.json({ isAdmin });
  } catch (err) {
    console.error("GET /api/admin/verify error:", err);
    return NextResponse.json(
      { isAdmin: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
