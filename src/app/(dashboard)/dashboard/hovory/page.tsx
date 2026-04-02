"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  CheckCircle2,
  XCircle,
  MessageSquare,
  BarChart3,
  Clock,
  User,
  Bot,
  PhoneCall,
  Loader2,
  PhoneOff,
  AlertTriangle,
  Send,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCallHistory } from "@/hooks/useCallHistory";
import { CriticalMoment } from "@/components/call/CriticalMoment";
import { EvalCategories } from "@/components/call/EvalCategories";
import type { CallRecord } from "@/types/dashboard";

function getSuccessRateBg(rate: number) {
  if (rate >= 70) return "bg-green-50 text-green-700";
  if (rate >= 50) return "bg-yellow-50 text-yellow-700";
  return "bg-red-50 text-red-700";
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getScoreRingColor(score: number) {
  if (score >= 70) return "stroke-green-500";
  if (score >= 50) return "stroke-yellow-500";
  return "stroke-red-500";
}

function formatCallDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          className={getScoreRingColor(score)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span
        className={`absolute text-2xl font-bold ${getScoreColor(score)}`}
      >
        {score}%
      </span>
    </div>
  );
}

function CallDetailModal({
  callId,
  callPreview,
  onClose,
}: {
  callId: string;
  callPreview: CallRecord;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"transcript" | "feedback">(
    "transcript"
  );
  const [fullCall, setFullCall] = useState<CallRecord | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  // Dispute form state
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeMessage, setDisputeMessage] = useState("");
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [existingDispute, setExistingDispute] = useState<{ status: string; admin_note?: string } | null>(null);

  const DISPUTE_REASONS = [
    "Nesouhlasím s hodnocením",
    "Agent byl zmatený / nereagoval správně",
    "Technický problém (zvuk, přerušení)",
    "Hovor se ukončil předčasně",
    "Jiný důvod",
  ];

  // Check for existing dispute
  useEffect(() => {
    async function checkDispute() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/calls/${callId}/dispute`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.dispute) setExistingDispute(data.dispute);
        }
      } catch { /* silent */ }
    }
    checkDispute();
  }, [callId]);

  async function handleDisputeSubmit() {
    if (!disputeReason) return;
    if (disputeReason === "Jiný důvod" && !disputeMessage.trim()) {
      setDisputeError("Při výběru 'Jiný důvod' je popis povinný");
      return;
    }
    setDisputeSubmitting(true);
    setDisputeError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/calls/${callId}/dispute`, {
        method: "POST",
        headers,
        body: JSON.stringify({ reason: disputeReason, message: disputeMessage.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba při odesílání");
      }
      setDisputeSuccess(true);
      setShowDisputeForm(false);
      const data = await res.json();
      setExistingDispute(data.dispute);
    } catch (err) {
      setDisputeError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setDisputeSubmitting(false);
    }
  }

  // Fetch full call detail (with transcripts) when modal opens
  useEffect(() => {
    async function fetchDetail() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/calls/${callId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const row = data.call;
          // Adapt the raw data to CallRecord
          const fb = Array.isArray(row.feedback)
            ? row.feedback[0] || null
            : row.feedback;
          const transcript = (row.transcripts || [])
            .sort(
              (a: { sort_order: number }, b: { sort_order: number }) =>
                a.sort_order - b.sort_order
            )
            .map(
              (t: {
                speaker: string;
                text: string;
                timestamp_label: string;
                highlight: string | null;
              }) => ({
                speaker: t.speaker,
                text: t.text,
                timestamp: t.timestamp_label,
                highlight: t.highlight,
              })
            );
          const feedback = fb
            ? {
                overallScore: fb.overall_score,
                strengths: fb.strengths || [],
                improvements: fb.improvements || [],
                fillerWords: fb.filler_words || [],
                recommendations: fb.recommendations || [],
                summaryGood: fb.summary_good || undefined,
                summaryImprove: fb.summary_improve || undefined,
                // V2 pole:
                criticalMoment: fb.critical_moment || undefined,
                categories: fb.categories || undefined,
              }
            : callPreview.feedback;

          setFullCall({
            ...callPreview,
            audioUrl: row.audio_url || callPreview.audioUrl,
            transcript,
            feedback,
          });
        }
      } catch (err) {
        console.error("Failed to fetch call detail:", err);
      } finally {
        setIsLoadingDetail(false);
      }
    }
    fetchDetail();
  }, [callId, callPreview]);

  const call = fullCall || callPreview;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-3xl sm:my-8 sm:mx-4 max-h-[92vh] sm:max-h-[90vh] border border-neutral-100 flex flex-col overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">
                  {call.agentName}
                </h2>
                <Badge variant="secondary" className="text-xs shrink-0">{call.agentPersonality}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-500">
                <span className="truncate">{call.scenario}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {call.duration}
                </span>
                <span className="shrink-0">{formatCallDate(call.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:block">
                <ScoreCircle score={call.feedback.overallScore} />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-50 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Mobile score - inline */}
          <div className="flex items-center gap-3 mt-3 sm:hidden">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(call.feedback.overallScore)}`}>
                {call.feedback.overallScore}%
              </span>
              <span className="text-xs text-neutral-400">Celkové skóre</span>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {call.audioUrl ? (
          <div className="px-4 sm:px-6 py-3 border-b border-neutral-100 bg-neutral-25">
            <audio controls className="w-full h-10" preload="metadata">
              <source src={call.audioUrl} type="audio/mpeg" />
              Váš prohlížeč nepodporuje přehrávání audia.
            </audio>
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-3 border-b border-neutral-100 bg-neutral-25">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <PhoneCall className="w-4 h-4" />
              <span>Nahrávka není k dispozici</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => setActiveTab("transcript")}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "transcript"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden xs:inline">Přepis</span>
            <span className="xs:hidden">Přepis</span>
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "feedback"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Zpětná vazba</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === "transcript" && (
            <div className="space-y-3">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  <span className="ml-2 text-sm text-neutral-500">
                    Načítám přepis...
                  </span>
                </div>
              ) : call.transcript.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Přepis hovoru není k dispozici</p>
                </div>
              ) : (
                call.transcript.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex ${entry.speaker === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                        entry.speaker === "user"
                          ? "bg-blue-50 text-blue-900"
                          : "bg-neutral-100 text-neutral-800"
                      } ${
                        entry.highlight === "good"
                          ? "border-2 border-green-300"
                          : entry.highlight === "mistake"
                            ? "border-2 border-red-300"
                            : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {entry.speaker === "user" ? (
                          <User className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                        <span className="text-xs font-medium opacity-70">
                          {entry.speaker === "user" ? "Vy" : call.agentName}{" "}
                          &middot; {entry.timestamp}
                        </span>
                        {entry.highlight === "good" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        )}
                        {entry.highlight === "mistake" && (
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{entry.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="flex justify-center">
                <ScoreCircle score={call.feedback.overallScore} />
              </div>

              {/* V2: Kritický moment */}
              {call.feedback.criticalMoment && (
                <CriticalMoment moment={call.feedback.criticalMoment} />
              )}

              {/* V2: 6 hodnotících kategorií */}
              {call.feedback.categories && (
                <EvalCategories categories={call.feedback.categories as Record<string, import("@/types/dashboard").EvalCategory>} />
              )}

              {/* Strengths */}
              {call.feedback.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Silné stránky
                  </h4>
                  <ul className="space-y-2">
                    {call.feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-neutral-700">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {call.feedback.improvements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Oblasti ke zlepšení
                  </h4>
                  <ul className="space-y-2">
                    {call.feedback.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Filler Words */}
              {call.feedback.fillerWords.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Výplňová slova
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {call.feedback.fillerWords.map((fw, i) => (
                      <Badge key={i} variant="warning">
                        &quot;{fw.word}&quot; &times; {fw.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {call.feedback.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Doporučení
                  </h4>
                  <ul className="space-y-2">
                    {call.feedback.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary-500 font-bold mt-0.5 shrink-0">
                          {i + 1}.
                        </span>
                        <span className="text-neutral-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dispute Form */}
        {showDisputeForm && !existingDispute && (
          <div className="px-4 sm:px-6 py-4 border-t border-neutral-100 bg-amber-50/30 space-y-3">
            <h4 className="text-sm font-semibold text-neutral-800">Nahlásit problém s hovorem</h4>
            <div className="space-y-2">
              {DISPUTE_REASONS.map((reason) => (
                <label key={reason} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="disputeReason"
                    value={reason}
                    checked={disputeReason === reason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{reason}</span>
                </label>
              ))}
            </div>
            <textarea
              value={disputeMessage}
              onChange={(e) => setDisputeMessage(e.target.value)}
              placeholder="Doplňující popis (volitelné)..."
              rows={2}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
            />
            {disputeError && (
              <div className="flex items-center gap-2 text-xs text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                {disputeError}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDisputeSubmit}
                disabled={disputeSubmitting || !disputeReason}
                className="gap-1.5"
              >
                {disputeSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Odeslat reklamaci
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDisputeForm(false)}>
                Zrušit
              </Button>
            </div>
          </div>
        )}

        {/* Dispute status */}
        {(existingDispute || disputeSuccess) && (
          <div className="px-4 sm:px-6 py-3 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm">
              {existingDispute?.status === "approved" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-green-700">Reklamace schválena</span>
                </>
              ) : existingDispute?.status === "rejected" ? (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">Reklamace zamítnuta</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-700">Reklamace odeslána — čeká na kontrolu</span>
                </>
              )}
            </div>
            {existingDispute?.admin_note && (
              <p className="text-xs text-neutral-600 mt-1 ml-6">{existingDispute.admin_note}</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between p-3 sm:p-4 border-t border-neutral-100 shrink-0">
          {!existingDispute && !disputeSuccess && !showDisputeForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDisputeForm(true)}
              className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Nahlásit problém
            </Button>
          )}
          {(existingDispute || disputeSuccess || showDisputeForm) && <div />}
          <Button variant="outline" size="sm" onClick={onClose}>
            Zavřít
          </Button>
        </div>
      </div>
    </div>
  );
}

function HovoryPageContent() {
  const { calls, isLoading, error } = useCallHistory({ limit: 100 });
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [autoOpenHandled, setAutoOpenHandled] = useState(false);

  // Auto-open call detail from query param (e.g. after finishing a lesson call)
  useEffect(() => {
    if (autoOpenHandled || isLoading || calls.length === 0) return;
    const detailId = searchParams.get("detail");
    if (detailId) {
      const call = calls.find((c) => c.id === detailId);
      if (call) {
        setSelectedCall(call);
      }
      setAutoOpenHandled(true);
    }
  }, [searchParams, calls, isLoading, autoOpenHandled]);

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const matchesSearch =
        searchQuery === "" ||
        call.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.scenario.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "all" ||
        (difficultyFilter === "easy" && call.successRate >= 70) ||
        (difficultyFilter === "medium" &&
          call.successRate >= 50 &&
          call.successRate < 70) ||
        (difficultyFilter === "hard" && call.successRate < 50);

      return matchesSearch && matchesDifficulty;
    });
  }, [calls, searchQuery, difficultyFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Historie hovorů</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Přehled všech tréninkových hovorů a jejich hodnocení
          </p>
        </div>
        <Link href="/dashboard/hovory/novy-hovor">
          <Button>
            <PhoneCall className="w-4 h-4 mr-2" />
            Nový hovor
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="w-10 h-10 mx-auto mb-3 text-red-400" />
            <p className="text-neutral-600 font-medium">Chyba při načítání</p>
            <p className="text-sm text-neutral-400 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && calls.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <PhoneOff className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-lg font-semibold text-neutral-700">Zatím žádné hovory</p>
            <p className="text-sm text-neutral-400 mt-2">
              Začněte svůj první tréninkový hovor a výsledky se zobrazí zde.
            </p>
            <Link href="/dashboard/hovory/novy-hovor">
              <Button className="mt-6">
                <PhoneCall className="w-4 h-4 mr-2" />
                Nový tréninkový hovor
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Content - only show when we have data */}
      {!isLoading && !error && calls.length > 0 && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Hledat podle jména agenta nebo scénáře..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-neutral-700"
                >
                  <option value="all">Všechny výsledky</option>
                  <option value="easy">Úspěšné (70%+)</option>
                  <option value="medium">Průměrné (50-70%)</option>
                  <option value="hard">Slabé (&lt;50%)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Calls Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-25">
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">
                        Datum
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">
                        AI Agent
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden md:table-cell">
                        Scénář
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">
                        Doba trvání
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-neutral-500">
                        Úspěšnost
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-neutral-500">
                        Akce
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCalls.map((call) => (
                      <tr
                        key={call.id}
                        className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors"
                      >
                        <td className="py-3 px-4 text-neutral-600">
                          {formatCallDate(call.date)}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-neutral-800">
                              {call.agentName}
                            </span>
                            <span className="block text-xs text-neutral-400 md:hidden mt-0.5">
                              {call.scenario}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 hidden md:table-cell">
                          {call.scenario}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 hidden sm:table-cell">
                          {call.duration}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={getSuccessRateBg(call.successRate)}>
                            {call.successRate > 0 ? `${call.successRate}%` : "Čeká..."}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCall(call)}
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCalls.length === 0 && (
                  <div className="text-center py-12 text-neutral-400">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Žádné hovory neodpovídají filtru.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Call Detail Modal */}
      {selectedCall && (
        <CallDetailModal
          callId={selectedCall.id}
          callPreview={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}

export default function HovoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    }>
      <HovoryPageContent />
    </Suspense>
  );
}
