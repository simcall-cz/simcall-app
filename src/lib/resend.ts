import { Resend } from "resend";

// Singleton Resend client
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
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
