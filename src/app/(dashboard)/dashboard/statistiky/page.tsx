"use client";

import { useMemo, useEffect, useState } from "react";
import { Phone, TrendingUp, Clock, Award, Lock, GraduationCap, Target, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallHistory } from "@/hooks/useCallHistory";
import { getAuthHeaders } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { lessonsV2, CATEGORIES, CATEGORY_CONFIG } from "@/data/lessons-v2";

interface LessonProgress {
  lesson_number: number;
  sub_scenario: number;
  attempt: number;
  score: number;
}

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

function isLessonCompleted(lessonNum: number, progress: LessonProgress[]): boolean {
  const lp = progress.filter((p) => p.lesson_number === lessonNum);
  for (let sub = 1; sub <= 3; sub++) {
    const best = lp.filter((p) => p.sub_scenario === sub).reduce((max, p) => Math.max(max, p.score), 0);
    if (best < 80) return false;
  }
  return lp.length > 0;
}

export default function StatistikyPage() {
  const { calls, isLoading } = useCallHistory({ limit: 200 });
  const [isFree, setIsFree] = useState(false);
  const [tab, setTab] = useState<"trenink" | "lekce">("trenink");
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [lessonProgressLoading, setLessonProgressLoading] = useState(true);

  useEffect(() => {
    getAuthHeaders().then((headers) => {
      Promise.all([
        fetch("/api/subscription", { headers }).then((r) => r.json()),
        fetch("/api/lessons/progress", { headers }).then((r) => r.ok ? r.json() : { progress: [] }),
      ])
        .then(([subData, progressData]) => {
          if (!subData || subData.error || subData.plan === "demo") {
            setIsFree(true);
          }
          setLessonProgress(progressData.progress || []);
        })
        .catch(() => setIsFree(true))
        .finally(() => setLessonProgressLoading(false));
    });
  }, []);

  // --- Training stats ---
  const completedCalls = calls.filter((c) => c.successRate > 0);
  const totalCalls = calls.length;
  const avgScore =
    completedCalls.length > 0
      ? Math.round(completedCalls.reduce((sum, c) => sum + c.successRate, 0) / completedCalls.length)
      : 0;
  const bestScore =
    completedCalls.length > 0 ? Math.max(...completedCalls.map((c) => c.successRate)) : 0;
  const totalMinutes = Math.round(
    calls.reduce((sum, c) => {
      const parts = c.duration.split(":");
      return sum + (parseInt(parts[0] || "0") * 60 + parseInt(parts[1] || "0"));
    }, 0) / 60
  );

  const scoreOverTime = useMemo(() => {
    const byDate: Record<string, { calls: number; totalRate: number }> = {};
    calls.forEach((call) => {
      if (call.successRate <= 0) return;
      const dateKey = formatDateShort(call.date);
      if (!byDate[dateKey]) byDate[dateKey] = { calls: 0, totalRate: 0 };
      byDate[dateKey].calls += 1;
      byDate[dateKey].totalRate += call.successRate;
    });
    return Object.entries(byDate).map(([dateLabel, data]) => ({
      dateLabel,
      score: Math.round(data.totalRate / data.calls),
    }));
  }, [calls]);

  const callsPerDay = useMemo(() => {
    const byDate: Record<string, number> = {};
    calls.forEach((call) => {
      const dateKey = formatDateShort(call.date);
      byDate[dateKey] = (byDate[dateKey] || 0) + 1;
    });
    return Object.entries(byDate).map(([dateLabel, count]) => ({ dateLabel, count }));
  }, [calls]);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-30", count: 0, color: "#EF4444" },
      { range: "31-50", count: 0, color: "#F59E0B" },
      { range: "51-70", count: 0, color: "#3B82F6" },
      { range: "71-100", count: 0, color: "#22C55E" },
    ];
    completedCalls.forEach((c) => {
      if (c.successRate <= 30) buckets[0].count++;
      else if (c.successRate <= 50) buckets[1].count++;
      else if (c.successRate <= 70) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [completedCalls]);

  // --- Lesson stats ---
  const lessonCompletedCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= 100; i++) {
      if (isLessonCompleted(i, lessonProgress)) count++;
    }
    return count;
  }, [lessonProgress]);

  const lessonTotalAttempts = lessonProgress.length;

  const lessonAvgScore = useMemo(() => {
    if (lessonProgress.length === 0) return 0;
    return Math.round(lessonProgress.reduce((sum, p) => sum + p.score, 0) / lessonProgress.length);
  }, [lessonProgress]);

  const lessonBestScore = useMemo(() => {
    if (lessonProgress.length === 0) return 0;
    return Math.max(...lessonProgress.map((p) => p.score));
  }, [lessonProgress]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catLessons = lessonsV2.filter((l) => l.category === cat);
      const catProgress = lessonProgress.filter((p) => catLessons.some((l) => l.number === p.lesson_number));
      const catCompleted = catLessons.filter((l) => isLessonCompleted(l.number, lessonProgress)).length;
      const catAvg = catProgress.length > 0
        ? Math.round(catProgress.reduce((s, p) => s + p.score, 0) / catProgress.length)
        : null;
      return { category: cat, total: catLessons.length, completed: catCompleted, avgScore: catAvg };
    });
  }, [lessonProgress]);

  const lessonScoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-30", count: 0, color: "#EF4444" },
      { range: "31-50", count: 0, color: "#F59E0B" },
      { range: "51-70", count: 0, color: "#3B82F6" },
      { range: "71-100", count: 0, color: "#22C55E" },
    ];
    lessonProgress.forEach((p) => {
      if (p.score <= 30) buckets[0].count++;
      else if (p.score <= 50) buckets[1].count++;
      else if (p.score <= 70) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [lessonProgress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500" />
      </div>
    );
  }

  const trainStatCards = [
    { label: "Celkem hovorů", value: totalCalls.toString(), icon: Phone, bg: "bg-neutral-50", iconColor: "text-neutral-600" },
    { label: "Průměrné skóre", value: avgScore > 0 ? `${avgScore}%` : "—", icon: TrendingUp, bg: "bg-green-50", iconColor: "text-green-600" },
    { label: "Nejlepší skóre", value: bestScore > 0 ? `${bestScore}%` : "—", icon: Award, bg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Celkový čas tréninku", value: totalMinutes > 0 ? `${totalMinutes} min` : "—", icon: Clock, bg: "bg-blue-50", iconColor: "text-blue-600" },
  ];

  const lessonStatCards = [
    { label: "Splněné lekce", value: `${lessonCompletedCount}/100`, icon: GraduationCap, bg: "bg-neutral-50", iconColor: "text-neutral-600" },
    { label: "Průměrné skóre", value: lessonAvgScore > 0 ? `${lessonAvgScore}%` : "—", icon: TrendingUp, bg: "bg-green-50", iconColor: "text-green-600" },
    { label: "Nejlepší skóre", value: lessonBestScore > 0 ? `${lessonBestScore}%` : "—", icon: Award, bg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Celkem pokusů", value: lessonTotalAttempts > 0 ? lessonTotalAttempts.toString() : "—", icon: Target, bg: "bg-blue-50", iconColor: "text-blue-600" },
  ];

  const pageContent = (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Statistiky</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Přehled vašeho pokroku
        </p>
      </div>

      {/* Tab switch */}
      <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
        <button
          onClick={() => setTab("trenink")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "trenink"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          Trénink
        </button>
        <button
          onClick={() => setTab("lekce")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "lekce"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          Lekce
        </button>
      </div>

      {tab === "trenink" ? (
        <>
          {/* Training Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trainStatCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 truncate">{stat.label}</p>
                      <p className="text-lg font-semibold text-neutral-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalCalls === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <Phone className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                <p className="text-neutral-500 font-medium">Zatím žádná data</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Zrealizujte první tréninkový hovor pro zobrazení statistik
                </p>
              </CardContent>
            </Card>
          )}

          {scoreOverTime.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Vývoj skóre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="dateLabel" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} domain={[0, 100]} unit="%" />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} formatter={(value: any) => [`${value}%`, "Skóre"]} />
                      <Area type="monotone" dataKey="score" stroke="#EF4444" strokeWidth={2} fill="url(#scoreGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {completedCalls.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {callsPerDay.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Počet hovorů za den</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={callsPerDay}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="dateLabel" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Rozložení skóre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="range" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {scoreDistribution.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Lesson Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {lessonStatCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 truncate">{stat.label}</p>
                      <p className="text-lg font-semibold text-neutral-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {lessonTotalAttempts === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                <p className="text-neutral-500 font-medium">Zatím žádná data</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Začněte plnit lekce pro zobrazení statistik
                </p>
              </CardContent>
            </Card>
          )}

          {/* Category progress */}
          {lessonTotalAttempts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Progress dle kategorií</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.map((cs) => {
                    const pct = cs.total > 0 ? Math.round((cs.completed / cs.total) * 100) : 0;
                    return (
                      <div key={cs.category} className="flex items-center gap-3">
                        <span className="text-sm text-neutral-700 w-40 truncate">{cs.category}</span>
                        <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500 w-16 text-right">
                          {cs.completed}/{cs.total}
                        </span>
                        {cs.avgScore !== null && (
                          <span className="text-xs font-bold text-neutral-600 w-10 text-right">{cs.avgScore}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson score distribution */}
          {lessonTotalAttempts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Rozložení skóre z lekcí</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lessonScoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="range" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {lessonScoreDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  if (isFree) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none opacity-60">
          {pageContent}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-8 text-center max-w-sm mx-4">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-neutral-500" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Statistiky jsou zamčeny</h3>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              Podrobné statistiky jsou dostupné od plánu Solo (od 990 Kč/měs).
            </p>
            <Link href="/cenik" className="mt-5 block">
              <Button className="w-full">Vybrat plán</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return pageContent;
}
