import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- Admin login page is always accessible ----
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // ---- Protected routes: require Supabase authentication ----
  const protectedPaths = ["/dashboard", "/admin", "/manager"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);

  if (!token) {
    const loginUrl = new URL("/prihlaseni", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyToken(token);
  if (!user) {
    const loginUrl = new URL("/prihlaseni", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ---- Admin routes: require admin email + DB role ----
  if (pathname.startsWith("/admin")) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Secondary check: verify DB role to prevent email-spoofing access
    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ---- Manager routes: require team plan ----
  if (pathname.startsWith("/manager")) {
    const profile = await getUserProfile(user.id);
    if (!profile || !["team", "team_manager", "admin"].includes(profile.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// ============================================================
// Helpers
// ============================================================

function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  const explicitToken = request.cookies.get("sb-access-token")?.value;
  if (explicitToken && explicitToken.length > 20) {
    return explicitToken;
  }

  const cookies = request.cookies;
  for (const [name, cookie] of cookies) {
    if (name.includes("auth-token") || name.includes("access-token")) {
      try {
        const parsed = JSON.parse(cookie.value);
        if (parsed?.access_token) return parsed.access_token;
        if (typeof parsed === "string") return parsed;
      } catch {
        if (cookie.value && cookie.value.length > 20) return cookie.value;
      }
    }
  }

  return null;
}

async function verifyToken(token: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

async function getUserProfile(userId: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    return data;
  } catch {
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|ico|svg|jpg|jpeg|webp|gif)).*)",
  ],
};
