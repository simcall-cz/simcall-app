import { Resend } from "resend";

// Do not use a global _resend variable here, because in Vercel serverless
// the env variables might not be available during the first module evaluation.
// Always instantiate inside the getter using process.env directly.
export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[resend] RESEND_API_KEY is missing in process.env");
    throw new Error("RESEND_API_KEY is not set in environment variables");
  }
  return new Resend(apiKey);
}

/**
 * Default "from" address — must be a verified domain in Resend.
 * Read at call time, not module load time (important for Vercel serverless).
 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || "SimCall <onboarding@resend.dev>";
}

// Keep the export for backward compatibility but make it a getter
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SimCall <onboarding@resend.dev>";

/**
 * Admin email — receives notifications about new contacts, meetings, etc.
 */
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "simcallcz@gmail.com";

/**
 * Base URL for links in emails.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://simcall.cz";
