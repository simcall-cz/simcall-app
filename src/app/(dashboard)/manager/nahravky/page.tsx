"use client";

import { useState } from "react";
import { Search, Play, Pause, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { callHistory } from "@/data/dashboard/call-history";
import { teamMembers } from "@/data/dashboard/team-data";

const allRecordings = callHistory.map((call, index) => ({
  ...call,
  memberName: teamMembers[index % teamMembers.length].name,
  memberInitials: teamMembers[index % teamMembers.length].avatarInitials,
}));

export default function NahravkyPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = allRecordings.filter(
    (r) =>
      r.memberName.toLowerCase().includes(search.toLowerCase()) ||
      r.scenario.toLowerCase().includes(search.toLowerCase()) ||
      r.agentName.toLowerCase().includes(search.toLowerCase())
  );

  function getScoreBadgeVariant(rate: number) {
    if (rate >= 70) return "success" as const;
    if (rate >= 50) return "warning" as const;
    return "default" as const;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Nahrávky</h1>
        <Badge variant="secondary">{allRecordings.length} nahrávek celkem</Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Hledat podle makléře, scénáře nebo AI agenta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-10 pr-4 text-neutral-800 placeholder:text-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      <div className="space-y-3">
        {filtered.map((recording) => {
          const isExpanded = expandedId === recording.id;
          const isPlaying = playingId === recording.id;

          return (
            <Card key={recording.id} className="transition-shadow hover:shadow-lg">
              {/* Row */}
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : recording.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  {/* Play Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingId(isPlaying ? null : recording.id);
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors hover:bg-primary-100"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm sm:text-base text-neutral-800 truncate">{recording.memberName}</span>
                      <span className="text-neutral-300 hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm text-neutral-500 truncate">{recording.scenario}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 sm:gap-3 text-xs text-neutral-400 flex-wrap">
                      <span>
                        {new Date(recording.date).toLocaleDateString("cs-CZ", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span>{recording.duration}</span>
                      <span className="hidden sm:inline">AI: {recording.agentName}</span>
                    </div>
                  </div>

                  {/* Score + Expand */}
                  <Badge variant={getScoreBadgeVariant(recording.successRate)}>
                    {recording.successRate}%
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 p-4">
                    {/* Audio Player Mock */}
                    <div className="mb-4 rounded-lg bg-neutral-50 p-4">
                      <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                        <span>0:00</span>
                        <span>{recording.duration}</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200">
                        <div
                          className="h-2 rounded-full bg-primary-500 transition-all"
                          style={{ width: isPlaying ? "35%" : "0%" }}
                        />
                      </div>
                    </div>

                    {/* Quick Transcript Preview */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-neutral-700">Ukázka přepisu</h4>
                      <div className="space-y-2">
                        {recording.transcript.slice(0, 4).map((entry, i) => (
                          <div
                            key={i}
                            className={`rounded-lg p-2.5 sm:p-3 text-sm ${
                              entry.speaker === "user"
                                ? "ml-4 sm:ml-8 bg-primary-50 text-neutral-700"
                                : "mr-4 sm:mr-8 bg-neutral-50 text-neutral-600"
                            } ${
                              entry.highlight === "good"
                                ? "border-l-2 border-green-400"
                                : entry.highlight === "mistake"
                                ? "border-l-2 border-red-400"
                                : ""
                            }`}
                          >
                            <span className="mb-1 block text-xs font-medium text-neutral-400">
                              {entry.speaker === "user" ? recording.memberName : recording.agentName} · {entry.timestamp}
                            </span>
                            {entry.text}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Summary */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-green-50 p-3">
                        <h5 className="mb-1 text-xs font-semibold text-green-700">Silné stránky</h5>
                        <ul className="space-y-1">
                          {recording.feedback.strengths.slice(0, 2).map((s, i) => (
                            <li key={i} className="text-xs text-green-600">
                              ✓ {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-red-50 p-3">
                        <h5 className="mb-1 text-xs font-semibold text-red-700">Ke zlepšení</h5>
                        <ul className="space-y-1">
                          {recording.feedback.improvements.slice(0, 2).map((s, i) => (
                            <li key={i} className="text-xs text-red-600">
                              ✗ {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-neutral-50 p-3">
                        <h5 className="mb-1 text-xs font-semibold text-neutral-700">Výplňová slova</h5>
                        <div className="flex flex-wrap gap-1">
                          {recording.feedback.fillerWords.map((fw, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {fw.word} ({fw.count}×)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        Zobrazit celý detail
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-400">Žádné nahrávky neodpovídají vašemu vyhledávání.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
