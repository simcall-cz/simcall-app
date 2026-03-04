"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * Detects Supabase PASSWORD_RECOVERY event (from reset email link)
 * and redirects the user to /nove-heslo page.
 * 
 * Include this component in the root layout so it runs on every page.
 */
export function AuthRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check URL hash for recovery token on initial load
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.includes("type=recovery")) {
        // Pass the hash to /nove-heslo so it can pick up the token
        router.replace(`/nove-heslo${hash}`);
        return;
      }
    }

    // Also listen for Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          router.replace("/nove-heslo");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
