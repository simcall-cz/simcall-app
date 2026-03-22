"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Check,
  Lock,
  GraduationCap,
  BarChart3,
  Target,
  TrendingUp,
  TrendingDown,
  Home,
  Key,
  Banknote,
  Scale,
  MapPin,
  Wrench,
  FileText,
  Building2,
  Megaphone,
  Handshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/auth";
import { lessonsV2, CATEGORIES, CATEGORY_CONFIG, PROGRESS_LEVELS } from "@/data/lessons-v2";

interface ProgressRecord {
  lesson_number: number;
  sub_scenario: number;
  attempt: number;
  score: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Home, Key, Banknote, Scale, MapPin, Wrench, FileText, Building2, Megaphone, Handshake,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; nodeDone: string }> = {
  blue:    { bg: "bg-blue-50/60",    border: "border-blue-200",    text: "text-blue-700",    nodeDone: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50/60", border: "border-emerald-200", text: "text-emerald-700", nodeDone: "bg-emerald-500" },
  yellow:  { bg: "bg-yellow-50/60",  border: "border-yellow-200",  text: "text-yellow-700",  nodeDone: "bg-yellow-500" },
  purple:  { bg: "bg-purple-50/60",  border: "border-purple-200",  text: "text-purple-700",  nodeDone: "bg-purple-500" },
  indigo:  { bg: "bg-indigo-50/60",  border: "border-indigo-200",  text: "text-indigo-700",  nodeDone: "bg-indigo-500" },
  orange:  { bg: "bg-orange-50/60",  border: "border-orange-200",  text: "text-orange-700",  nodeDone: "bg-orange-500" },
  cyan:    { bg: "bg-cyan-50/60",    border: "border-cyan-200",    text: "text-cyan-700",    nodeDone: "bg-cyan-500" },
  rose:    { bg: "bg-rose-50/60",    border: "border-rose-200",    text: "text-rose-700",    nodeDone: "bg-rose-500" },
  pink:    { bg: "bg-pink-50/60",    border: "border-pink-200",    text: "text-pink-700",    nodeDone: "bg-pink-500" },
  teal:    { bg: "bg-teal-50/60",    border: "border-teal-200",    text: "text-teal-700",    nodeDone: "bg-teal-500" },
};

function isLessonCompleted(lessonNum: number, progress: ProgressRecord[]): boolean {
  const lp = progress.filter((p) => p.lesson_number === lessonNum);
  for (let sub = 1; sub <= 3; sub++) {
    const best = lp.filter((p) => p.sub_scenario === sub).reduce((max, p) => Math.max(max, p.score), 0);
    if (best < 80) return false;
  }
  return lp.length > 0;
}

function getCompletedCount(progress: ProgressRecord[]): number {
  let count = 0;
  for (let i = 1; i <= 100; i++) {
    if (isLessonCompleted(i, progress)) count++;
  }
  return count;
}

export default function MaklerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/lessons/progress/${userId}`, { headers });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Chyba při načítání");
        }
        const data = await res.json();
        setProgress(data.progress || []);
        setUserName(data.user?.fullName || "");
        setUserEmail(data.user?.email || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const completedCount = useMemo(() => getCompletedCount(progress), [progress]);
  const totalAttempts = progress.length;
  const avgScore = useMemo(() => {
    if (progress.length === 0) return 0;
    return Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length);
  }, [progress]);

  const avgAttemptsPerLesson = useMemo(() => {
    if (completedCount === 0) return 0;
    const completedLessons = new Set<number>();
    for (let i = 1; i <= 100; i++) {
      if (isLessonCompleted(i, progress)) completedLessons.add(i);
    }
    const totalAttemptsForCompleted = progress.filter((p) => completedLessons.has(p.lesson_number)).length;
    return Math.round((totalAttemptsForCompleted / completedCount) * 10) / 10;
  }, [progress, completedCount]);

  // Category stats
  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catLessons = lessonsV2.filter((l) => l.category === cat);
      const catProgress = progress.filter((p) => catLessons.some((l) => l.number === p.lesson_number));
      const catCompleted = catLessons.filter((l) => isLessonCompleted(l.number, progress)).length;
      const catAvg = catProgress.length > 0
        ? Math.round(catProgress.reduce((s, p) => s + p.score, 0) / catProgress.length)
        : null;
      return { category: cat, total: catLessons.length, completed: catCompleted, avgScore: catAvg };
    });
  }, [progress]);

  const bestCategory = categoryStats.filter((c) => c.avgScore !== null).sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0))[0];
  const worstCategory = categoryStats.filter((c) => c.avgScore !== null).sort((a, b) => (a.avgScore || 0) - (b.avgScore || 0))[0];

  const level = PROGRESS_LEVELS.find((l) => completedCount >= l.min && completedCount <= l.max) || PROGRESS_LEVELS[0];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-neutral-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.push("/manager/tym")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět na tým
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/manager/tym")}
        className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Zpět na tým
      </button>

      {/* User header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
          <span className="text-lg font-bold text-primary-600">
            {userName ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?"}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{userName || "Makléř"}</h1>
          <p className="text-sm text-neutral-500">{userEmail}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">{level.title}</p>
            <p className="text-xs text-neutral-500">{level.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-neutral-900">{completedCount}<span className="text-sm font-normal text-neutral-400">/100</span></p>
          </div>
        </div>
        <div className="relative h-3 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${completedCount}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Splněné lekce", value: `${completedCount}/100`, icon: GraduationCap },
          { label: "Průměrné skóre", value: avgScore > 0 ? `${avgScore}%` : "--", icon: BarChart3 },
          { label: "Celkem pokusů", value: totalAttempts.toString(), icon: Target },
          { label: "Pokusů/lekce", value: avgAttemptsPerLesson > 0 ? avgAttemptsPerLesson.toString() : "--", icon: Target },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-neutral-400" />
              <span className="text-xs text-neutral-500">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Best/worst categories */}
      {bestCategory && worstCategory && bestCategory.category !== worstCategory.category && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl border border-green-200 bg-green-50/40 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Nejlepší kategorie</span>
            </div>
            <p className="text-sm font-bold text-neutral-900">{bestCategory.category}</p>
            <p className="text-xs text-neutral-500">{bestCategory.avgScore}% průměr</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-700 font-medium">Nejhorší kategorie</span>
            </div>
            <p className="text-sm font-bold text-neutral-900">{worstCategory.category}</p>
            <p className="text-xs text-neutral-500">{worstCategory.avgScore}% průměr</p>
          </div>
        </div>
      )}

      {/* Category breakdown */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-neutral-900 mb-3">Progress dle kategorií</h2>
        <div className="space-y-2">
          {categoryStats.map((cs) => {
            const catConf = CATEGORY_CONFIG[cs.category];
            const colors = COLOR_MAP[catConf?.color || "blue"];
            const IconComp = CATEGORY_ICONS[catConf?.icon || "Home"] || Home;
            const pct = cs.total > 0 ? Math.round((cs.completed / cs.total) * 100) : 0;

            return (
              <div key={cs.category} className={cn("flex items-center gap-3 rounded-lg border p-3", colors.bg, colors.border)}>
                <IconComp className={cn("h-4 w-4 shrink-0", colors.text)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-900">{cs.category}</span>
                    <span className="text-xs text-neutral-500">{cs.completed}/{cs.total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                    <div className={cn("h-full rounded-full", colors.nodeDone)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {cs.avgScore !== null && (
                  <span className="text-xs font-bold text-neutral-600 shrink-0">{cs.avgScore}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson detail table */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-neutral-900 mb-3">Detail lekcí</h2>
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500">#</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500">Název</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-neutral-500">Skóre</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-neutral-500">Pokusy</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-neutral-500">Stav</th>
                </tr>
              </thead>
              <tbody>
                {lessonsV2.map((lesson) => {
                  const lp = progress.filter((p) => p.lesson_number === lesson.number);
                  const done = isLessonCompleted(lesson.number, progress);
                  const attempts = lp.length;
                  const bestScore = lp.length > 0
                    ? Math.round(lp.reduce((s, p) => s + p.score, 0) / lp.length)
                    : null;

                  return (
                    <tr key={lesson.number} className="border-b border-neutral-50 last:border-0">
                      <td className="px-4 py-2 text-neutral-400 font-mono text-xs">
                        {String(lesson.number).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-2 text-neutral-900 truncate max-w-[200px]">
                        {lesson.title}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {bestScore !== null ? (
                          <span className={cn("font-bold", done ? "text-green-600" : "text-amber-600")}>
                            {bestScore}%
                          </span>
                        ) : (
                          <span className="text-neutral-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center text-neutral-500">
                        {attempts > 0 ? attempts : "--"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {done ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : attempts > 0 ? (
                          <span className="text-xs text-amber-600 font-medium">Probíhá</span>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-neutral-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
