"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCallHistory } from "@/hooks/useCallHistory";
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

  // Fetch full call detail (with transcripts) when modal opens
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/calls/${callId}`);
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 mx-4 border border-neutral-100">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-100">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-neutral-900">
                {call.agentName}
              </h2>
              <Badge variant="secondary">{call.agentPersonality}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <span>{call.scenario}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {call.duration}
              </span>
              <span>{formatCallDate(call.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ScoreCircle score={call.feedback.overallScore} />
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Player */}
        {call.audioUrl ? (
          <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-25">
            <audio controls className="w-full h-10" preload="metadata">
              <source src={call.audioUrl} type="audio/mpeg" />
              Váš prohlížeč nepodporuje přehrávání audia.
            </audio>
          </div>
        ) : (
          <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-25">
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
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "transcript"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Přepis hovoru
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "feedback"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Zpětná vazba
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
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
                      className={`max-w-[80%] rounded-xl px-4 py-3 ${
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

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-neutral-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Zavřít
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HovoryPage() {
  const { calls, isLoading, error } = useCallHistory({ limit: 100 });
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

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
