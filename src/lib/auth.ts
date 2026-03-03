import { getSupabase, createServerClient } from "./supabase";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

// ============================================================
// Types
// ============================================================
export type PlanRole = "demo" | "solo" | "team" | "admin";

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: "free" | "paid";
  planRole: PlanRole;
}

export interface SubscriptionInfo {
  id: string;
  plan: "solo" | "team";
  tier: number;
  status: "active" | "cancelled" | "past_due" | "trialing";
  callsUsed: number;
  callsLimit: number;
  agentsLimit: number;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface CallLimitCheck {
  canCall: boolean;
  used: number;
  limit: number;
  remaining: number;
  planRole: PlanRole;
}

// ============================================================
// Constants
// ============================================================
const FREE_CALLS_LIMIT = 3;

// ============================================================
// Client-side functions
// ============================================================

/**
 * Client-side: get auth headers to send with API requests
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
  };
}

/**
 * Client-side: get user role & name fast from session (no DB query)
 * Uses user_metadata stored during signup — instant, no network call
 */
export async function getUserSessionInfo(): Promise<UserSession | null> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const email = session.user.email || "";
  const isAdmin = isAdminEmail(email);

  return {
    id: session.user.id,
    email,
    fullName: session.user.user_metadata?.full_name || "",
    role: (session.user.user_metadata?.role as "free" | "paid") || "free",
    planRole: isAdmin ? "admin" : ((session.user.user_metadata?.plan_role as PlanRole) || "demo"),
  };
}

/**
 * Client-side: get current user's full profile from DB (slower, more data)
 */
export async function getCurrentUserProfile() {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const email = profile?.email || session.user.email || "";

  return {
    id: session.user.id,
    email,
    fullName: profile?.full_name || session.user.user_metadata?.full_name || "",
    role: (profile?.role as "free" | "paid") || "free",
    planRole: isAdminEmail(email) ? "admin" as PlanRole : ((profile?.role as PlanRole) || "demo"),
    companyId: profile?.company_id || null,
    subscriptionId: profile?.subscription_id || null,
  };
}

/**
 * Client-side: get subscription info for current user
 */
export async function getUserSubscription(): Promise<SubscriptionInfo | null> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    plan: data.plan,
    tier: data.tier,
    status: data.status,
    callsUsed: data.calls_used,
    callsLimit: data.calls_limit,
    agentsLimit: data.agents_limit,
    currentPeriodEnd: data.current_period_end,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
  };
}

// ============================================================
// Server-side functions
// ============================================================

/**
 * Server-side: extract authenticated user from API request
 */
export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

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
}

/**
 * Server-side: check if user is admin
 */
export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Server-side: check call limits for a user
 */
export async function checkCallLimit(userId: string): Promise<CallLimitCheck> {
  const db = createServerClient();

  // 1. Check if user has active subscription
  const { data: sub } = await db
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (sub) {
    const remaining = Math.max(0, sub.calls_limit - sub.calls_used);
    return {
      canCall: remaining > 0,
      used: sub.calls_used,
      limit: sub.calls_limit,
      remaining,
      planRole: sub.plan as PlanRole,
    };
  }

  // 2. No subscription — demo user, check total calls
  const { count } = await db
    .from("calls")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const used = count || 0;
  const remaining = Math.max(0, FREE_CALLS_LIMIT - used);

  return {
    canCall: remaining > 0,
    used,
    limit: FREE_CALLS_LIMIT,
    remaining,
    planRole: "demo",
  };
}

/**
 * Server-side: increment call usage for subscribed user
 */
export async function incrementCallUsage(userId: string): Promise<void> {
  const db = createServerClient();

  const { data: sub } = await db
    .from("subscriptions")
    .select("id, calls_used")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (sub) {
    await db
      .from("subscriptions")
      .update({
        calls_used: sub.calls_used + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sub.id);
  }
}

/**
 * Server-side: get user's plan role from profile
 */
export async function getUserPlanRole(userId: string): Promise<PlanRole> {
  const db = createServerClient();

  const { data: profile } = await db
    .from("profiles")
    .select("role, email")
    .eq("id", userId)
    .single();

  if (!profile) return "demo";
  if (isAdminEmail(profile.email)) return "admin";
  return (profile.role as PlanRole) || "demo";
}

/**
 * Server-side: verify request is from admin
 */
export async function verifyAdmin(request: NextRequest): Promise<{ isAdmin: boolean; user: { id: string; email?: string } | null }> {
  const user = await getUserFromRequest(request);
  if (!user) return { isAdmin: false, user: null };

  return {
    isAdmin: isAdminEmail(user.email || ""),
    user,
  };
}

/**
 * Server-side: verify request is from team manager
 */
export async function verifyManager(request: NextRequest): Promise<{ isManager: boolean; user: { id: string; email?: string } | null; companyId: string | null }> {
  const user = await getUserFromRequest(request);
  if (!user) return { isManager: false, user: null, companyId: null };

  const db = createServerClient();

  // 1. Check company_members for manager role
  const { data: member } = await db
    .from("company_members")
    .select("company_id, role")
    .eq("user_id", user.id)
    .eq("role", "manager")
    .limit(1)
    .single();

  if (member) {
    return { isManager: true, user, companyId: member.company_id };
  }

  // 2. Fallback: check profiles.role for team_manager (admin-assigned)
  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile && (profile.role === "team_manager" || profile.role === "admin")) {
    return { isManager: true, user, companyId: null };
  }

  return { isManager: false, user, companyId: null };
}
