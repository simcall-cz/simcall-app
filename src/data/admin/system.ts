import type { ErrorLogEntry } from "@/types/admin";

export const errorLog: ErrorLogEntry[] = [
  { id: "err-1", timestamp: "2026-02-28T15:42:00", service: "elevenlabs", message: "Audio download timeout po 30s — conv_8901xyz", severity: "warning" },
  { id: "err-2", timestamp: "2026-02-28T14:18:00", service: "openai", message: "Rate limit 429 — retry successful po 2s", severity: "warning" },
  { id: "err-3", timestamp: "2026-02-28T11:05:00", service: "supabase", message: "Storage upload failed — bucket full (resolved)", severity: "error" },
  { id: "err-4", timestamp: "2026-02-27T22:30:00", service: "elevenlabs", message: "WebRTC connection failed — user network issue", severity: "info" },
  { id: "err-5", timestamp: "2026-02-27T16:12:00", service: "openai", message: "JSON parse error — fallback analysis used", severity: "warning" },
  { id: "err-6", timestamp: "2026-02-27T09:45:00", service: "vercel", message: "Function timeout 10s on /api/calls/process (fixed: maxDuration=60)", severity: "error" },
  { id: "err-7", timestamp: "2026-02-26T20:15:00", service: "elevenlabs", message: "Transcript empty po 6 retries — call marked failed", severity: "error" },
  { id: "err-8", timestamp: "2026-02-26T13:30:00", service: "supabase", message: "RLS policy denied — service role key resolved", severity: "warning" },
  { id: "err-9", timestamp: "2026-02-25T18:00:00", service: "openai", message: "Context length exceeded — transcript truncated", severity: "info" },
  { id: "err-10", timestamp: "2026-02-25T10:20:00", service: "vercel", message: "Cold start 4.2s na /api/calls — normal range", severity: "info" },
];

export const apiUsageDaily = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(2026, 1, 15 + i);
  return {
    date: `${date.getDate()}.${date.getMonth() + 1}.`,
    elevenlabs: 300 + Math.floor(Math.random() * 200),
    openai: 250 + Math.floor(Math.random() * 150),
  };
});
