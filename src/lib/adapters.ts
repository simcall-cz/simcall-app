import type { CallRecord, TranscriptEntry, CallFeedback } from "@/types/dashboard";

/**
 * Converts raw Supabase call data to the frontend CallRecord type
 */

interface SupabaseAgent {
  id: string;
  name: string;
  personality: string;
  avatar_initials: string;
}

interface SupabaseScenario {
  id: string;
  title: string;
}

interface SupabaseTranscript {
  speaker: "user" | "ai";
  text: string;
  timestamp_label: string;
  highlight: "good" | "mistake" | null;
  sort_order: number;
}

interface SupabaseFeedback {
  overall_score: number;
  strengths: string[];
  improvements: string[];
  filler_words: { word: string; count: number }[];
  recommendations: string[];
  summary_good?: string | null;
  summary_improve?: string | null;
  critical_moment?: { label: string; passed: boolean; evidence: string } | null;
  categories?: Record<string, unknown> | null;
}

interface SupabaseCallRow {
  id: string;
  date: string;
  duration_seconds: number;
  success_rate: number;
  status: string;
  audio_url: string | null;
  agents: SupabaseAgent | null;
  scenarios: SupabaseScenario | null;
  transcripts?: SupabaseTranscript[];
  feedback: SupabaseFeedback[] | SupabaseFeedback | null;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function adaptCallToRecord(row: SupabaseCallRow): CallRecord {
  // Handle feedback - can be array (from list query) or object (from detail)
  const fb: SupabaseFeedback | null = Array.isArray(row.feedback)
    ? row.feedback[0] || null
    : row.feedback;

  const transcript: TranscriptEntry[] = (row.transcripts || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((t) => ({
      speaker: t.speaker,
      text: t.text,
      timestamp: t.timestamp_label,
      highlight: t.highlight,
    }));

  const feedback: CallFeedback = fb
    ? {
        overallScore: fb.overall_score,
        strengths: fb.strengths || [],
        improvements: fb.improvements || [],
        fillerWords: fb.filler_words || [],
        recommendations: fb.recommendations || [],
        summaryGood: fb.summary_good ?? undefined,
        summaryImprove: fb.summary_improve ?? undefined,
        criticalMoment: fb.critical_moment ?? undefined,
        categories: fb.categories as CallFeedback["categories"],
      }
    : {
        overallScore: row.success_rate || 0,
        strengths: [],
        improvements: [],
        fillerWords: [],
        recommendations: [],
      };

  return {
    id: row.id,
    date: row.date,
    agentName: row.agents?.name || "Neznámý agent",
    agentPersonality: row.agents?.personality || "",
    scenario: row.scenarios?.title || (row.agents?.name ? `${row.agents.name}` : "Tréninkový hovor"),
    duration: formatDuration(row.duration_seconds),
    successRate: row.success_rate || fb?.overall_score || 0,
    audioUrl: row.audio_url || null,
    transcript,
    feedback,
  };
}

export function adaptCallsToRecords(rows: SupabaseCallRow[]): CallRecord[] {
  return rows.map(adaptCallToRecord);
}
