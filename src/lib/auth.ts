import { getSupabase } from "./supabase";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

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
 * Client-side: get current user's profile (id, role, name, email)
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

  return profile
    ? {
        id: session.user.id,
        email: profile.email || session.user.email,
        fullName: profile.full_name,
        role: profile.role as "free" | "paid",
      }
    : {
        id: session.user.id,
        email: session.user.email || "",
        fullName: session.user.user_metadata?.full_name || "",
        role: (session.user.user_metadata?.role as "free" | "paid") || "free",
      };
}

/**
 * Server-side: extract authenticated user from API request
 */
export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  // Use anon key client to verify the user's token
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
