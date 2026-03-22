"use client";

import { useState, useMemo, useEffect } from "react";
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
import { getAuthHeaders } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminCallRecord {
  id: string;
  date: string;
  agentName: string;
  agentPersonality: string;
  scenario: string;
  duration: string;
  successRate: number;
  audioUrl: string | null;
  userName: string;
  userEmail: string;
  transcript: { speaker: string; text: string; timestamp: string; highlight: string | null }[];
  feedback: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    fillerWords: { word: string; count: number }[];
    recommendations: string[];
  };
}

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

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          className={getScoreRingColor(score)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className={`absolute text-2xl font-bold ${getScoreColor(score)}`}>
        {score}%
      </span>
    </div>
  );
}

function CallDetailModal({
  call,
  onClose,
}: {
  call: AdminCallRecord;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"transcript" | "feedback">("transcript");
  const [fullCall, setFullCall] = useState<AdminCallRecord | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/calls/${call.id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const row = data.call;
          const fb = Array.isArray(row.feedback) ? row.feedback[0] || null : row.feedback;
          const transcript = (row.transcripts || [])
            .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
            .map((t: { speaker: string; text: string; timestamp_label: string; highlight: string | null }) => ({
              speaker: t.speaker,
              text: t.text,
              timestamp: t.timestamp_label,
              highlight: t.highlight,
            }));
          const feedback = fb
            ? {
                overallScore: fb.overall_score,
                strengths: fb.strengths || [],
                improvements: fb.improvements || [],
                fillerWords: fb.filler_words || [],
                recommendations: fb.recommendations || [],
              }
            : call.feedback;
          setFullCall({
            ...call,
            audioUrl: row.audio_url || call.audioUrl,
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
  }, [call]);

  const c = fullCall || call;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-3xl sm:my-8 sm:mx-4 max-h-[92vh] sm:max-h-[90vh] border border-neutral-100 flex flex-col overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">
                  {c.agentName}
                </h2>
                <Badge variant="secondary" className="text-xs shrink-0">{c.agentPersonality}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-500">
                <span className="font-medium text-neutral-700">{c.userName || c.userEmail}</span>
                <span className="truncate">{c.scenario}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {c.duration}
                </span>
                <span className="shrink-0">{formatCallDate(c.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:block">
                <ScoreCircle score={c.feedback.overallScore} />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:hidden">
            <span className={`text-2xl font-bold ${getScoreColor(c.feedback.overallScore)}`}>
              {c.feedback.overallScore}%
            </span>
            <span className="text-xs text-neutral-400">Celkové skóre</span>
          </div>
        </div>

        {/* Audio Player */}
        {c.audioUrl ? (
          <div className="px-4 sm:px-6 py-3 border-b border-neutral-100 bg-neutral-25">
            <audio controls className="w-full h-10" preload="metadata">
              <source src={c.audioUrl} type="audio/mpeg" />
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
            Přepis
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
            Zpětná vazba
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === "transcript" && (
            <div className="space-y-3">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  <span className="ml-2 text-sm text-neutral-500">Načítám přepis...</span>
                </div>
              ) : c.transcript.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Přepis hovoru není k dispozici</p>
                </div>
              ) : (
                c.transcript.map((entry, i) => (
                  <div key={i} className={`flex ${entry.speaker === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                        entry.speaker === "user" ? "bg-blue-50 text-blue-900" : "bg-neutral-100 text-neutral-800"
                      } ${
                        entry.highlight === "good" ? "border-2 border-green-300"
                          : entry.highlight === "mistake" ? "border-2 border-red-300" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {entry.speaker === "user" ? (
                          <User className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                        <span className="text-xs font-medium opacity-70">
                          {entry.speaker === "user" ? c.userName || "Makléř" : c.agentName} &middot; {entry.timestamp}
                        </span>
                        {entry.highlight === "good" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                        {entry.highlight === "mistake" && <XCircle className="w-3.5 h-3.5 text-red-500" />}
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
              <div className="flex justify-center">
                <ScoreCircle score={c.feedback.overallScore} />
              </div>

              {c.feedback.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Silné stránky</h4>
                  <ul className="space-y-2">
                    {c.feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-neutral-700">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.feedback.improvements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Oblasti ke zlepšení</h4>
                  <ul className="space-y-2">
                    {c.feedback.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.feedback.fillerWords.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Výplňová slova</h4>
                  <div className="flex flex-wrap gap-2">
                    {c.feedback.fillerWords.map((fw, i) => (
                      <Badge key={i} variant="warning">
                        &quot;{fw.word}&quot; &times; {fw.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {c.feedback.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">Doporučení</h4>
                  <ul className="space-y-2">
                    {c.feedback.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary-500 font-bold mt-0.5 shrink-0">{i + 1}.</span>
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
        <div className="flex justify-end p-3 sm:p-4 border-t border-neutral-100 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Zavřít
          </Button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptAdminCall(row: any): AdminCallRecord {
  const fb = Array.isArray(row.feedback) ? row.feedback[0] || null : row.feedback;
  return {
    id: row.id,
    date: row.date,
    agentName: row.agents?.name || "Neznámý agent",
    agentPersonality: row.agents?.personality || "",
    scenario: row.scenarios?.title || "Neznámý scénář",
    duration: formatDuration(row.duration_seconds),
    successRate: row.success_rate || fb?.overall_score || 0,
    audioUrl: row.audio_url || null,
    userName: row.user_email || row.user_name || "—",
    userEmail: row.user_email || "",
    transcript: [],
    feedback: fb
      ? {
          overallScore: fb.overall_score,
          strengths: fb.strengths || [],
          improvements: fb.improvements || [],
          fillerWords: fb.filler_words || [],
          recommendations: fb.recommendations || [],
        }
      : { overallScore: row.success_rate || 0, strengths: [], improvements: [], fillerWords: [], recommendations: [] },
  };
}

export default function AdminHovoryPage() {
  const [calls, setCalls] = useState<AdminCallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<AdminCallRecord | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/admin/calls?limit=200", { headers });
        if (!res.ok) throw new Error("Nepodařilo se načíst hovory");
        const data = await res.json();
        setCalls((data.calls || []).map(adaptAdminCall));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const q = searchQuery.toLowerCase();
      return (
        searchQuery === "" ||
        call.agentName.toLowerCase().includes(q) ||
        call.scenario.toLowerCase().includes(q) ||
        call.userName.toLowerCase().includes(q) ||
        call.userEmail.toLowerCase().includes(q)
      );
    });
  }, [calls, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Hovory, Přehled</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Všechny tréninkové hovory všech uživatelů
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      )}

      {error && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="w-10 h-10 mx-auto mb-3 text-red-400" />
            <p className="text-neutral-600 font-medium">Chyba při načítání</p>
            <p className="text-sm text-neutral-400 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && calls.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <PhoneOff className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-lg font-semibold text-neutral-700">Zatím žádné hovory</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && calls.length > 0 && (
        <>
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Hledat podle uživatele, agenta nebo scénáře..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-25">
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">Datum</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">Uživatel</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">AI Agent</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden md:table-cell">Scénář</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">Doba</th>
                      <th className="text-center py-3 px-4 font-medium text-neutral-500">Skóre</th>
                      <th className="text-right py-3 px-4 font-medium text-neutral-500">Akce</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCalls.map((call) => (
                      <tr key={call.id} className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors">
                        <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">
                          {formatCallDate(call.date)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-neutral-800">{call.userName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-neutral-800">{call.agentName}</span>
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
                          <Button variant="ghost" size="sm" onClick={() => setSelectedCall(call)}>
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

      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}
