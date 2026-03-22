"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Check,
  Loader2,
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
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/auth";
import { lessonsV2, CATEGORIES, CATEGORY_CONFIG, PROGRESS_LEVELS } from "@/data/lessons-v2";
import Link from "next/link";

interface ProgressRecord {
  lesson_number: number;
  sub_scenario: number;
  attempt: number;
  score: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Home, Key, Banknote, Scale, MapPin, Wrench, FileText, Building2, Megaphone, Handshake,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; node: string; nodeDone: string; line: string }> = {
  blue:    { bg: "bg-blue-50/60",    border: "border-blue-200",    text: "text-blue-700",    node: "bg-blue-100 border-blue-300",    nodeDone: "bg-blue-500",    line: "bg-blue-200" },
  emerald: { bg: "bg-emerald-50/60", border: "border-emerald-200", text: "text-emerald-700", node: "bg-emerald-100 border-emerald-300", nodeDone: "bg-emerald-500", line: "bg-emerald-200" },
  yellow:  { bg: "bg-yellow-50/60",  border: "border-yellow-200",  text: "text-yellow-700",  node: "bg-yellow-100 border-yellow-300",  nodeDone: "bg-yellow-500",  line: "bg-yellow-200" },
  purple:  { bg: "bg-purple-50/60",  border: "border-purple-200",  text: "text-purple-700",  node: "bg-purple-100 border-purple-300",  nodeDone: "bg-purple-500",  line: "bg-purple-200" },
  indigo:  { bg: "bg-indigo-50/60",  border: "border-indigo-200",  text: "text-indigo-700",  node: "bg-indigo-100 border-indigo-300",  nodeDone: "bg-indigo-500",  line: "bg-indigo-200" },
  orange:  { bg: "bg-orange-50/60",  border: "border-orange-200",  text: "text-orange-700",  node: "bg-orange-100 border-orange-300",  nodeDone: "bg-orange-500",  line: "bg-orange-200" },
  cyan:    { bg: "bg-cyan-50/60",    border: "border-cyan-200",    text: "text-cyan-700",    node: "bg-cyan-100 border-cyan-300",    nodeDone: "bg-cyan-500",    line: "bg-cyan-200" },
  rose:    { bg: "bg-rose-50/60",    border: "border-rose-200",    text: "text-rose-700",    node: "bg-rose-100 border-rose-300",    nodeDone: "bg-rose-500",    line: "bg-rose-200" },
  pink:    { bg: "bg-pink-50/60",    border: "border-pink-200",    text: "text-pink-700",    node: "bg-pink-100 border-pink-300",    nodeDone: "bg-pink-500",    line: "bg-pink-200" },
  teal:    { bg: "bg-teal-50/60",    border: "border-teal-200",    text: "text-teal-700",    node: "bg-teal-100 border-teal-300",    nodeDone: "bg-teal-500",    line: "bg-teal-200" },
};

function isLessonCompleted(lessonNum: number, progress: ProgressRecord[]): boolean {
  const lessonProgress = progress.filter((p) => p.lesson_number === lessonNum);
  for (let sub = 1; sub <= 3; sub++) {
    const best = lessonProgress
      .filter((p) => p.sub_scenario === sub)
      .reduce((max, p) => Math.max(max, p.score), 0);
    if (best < 80) return false;
  }
  return lessonProgress.length > 0;
}

function isLessonUnlocked(lessonNum: number, progress: ProgressRecord[]): boolean {
  if (lessonNum === 1) return true;
  return isLessonCompleted(lessonNum - 1, progress);
}

function getBestScore(lessonNum: number, progress: ProgressRecord[]): number | null {
  const scores = progress
    .filter((p) => p.lesson_number === lessonNum)
    .map((p) => p.score);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getCompletedCount(progress: ProgressRecord[]): number {
  let count = 0;
  for (let i = 1; i <= 100; i++) {
    if (isLessonCompleted(i, progress)) count++;
  }
  return count;
}

function getProgressLevel(completed: number) {
  const pct = completed;
  return PROGRESS_LEVELS.find((l) => pct >= l.min && pct <= l.max) || PROGRESS_LEVELS[0];
}

export default function LekcePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = await getAuthHeaders();
        const [subRes, progressRes] = await Promise.all([
          fetch("/api/subscription", { headers }),
          fetch("/api/lessons/progress", { headers }),
        ]);

        const subData = await subRes.json();
        if (!subData || subData.error || subData.plan === "demo") {
          setIsFree(true);
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.progress || []);
        }
      } catch {
        setIsFree(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const completedCount = useMemo(() => getCompletedCount(progress), [progress]);
  const level = useMemo(() => getProgressLevel(completedCount), [completedCount]);
  const progressPct = completedCount;

  // Group lessons by category
  const lessonsByCategory = useMemo(() => {
    const grouped: Record<string, typeof lessonsV2> = {};
    for (const cat of CATEGORIES) {
      grouped[cat] = lessonsV2.filter((l) => l.category === cat);
    }
    return grouped;
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isFree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 mb-6">
          <Lock className="h-10 w-10 text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Lekce jsou dostupne v placenem planu
        </h1>
        <p className="text-neutral-500 max-w-md mb-6">
          100 strukturovanych lekci z realitni praxe s mapou postupu a sledovanim progressu.
        </p>
        <Link href="/dashboard/balicek">
          <Button size="lg" className="gap-2">
            <GraduationCap className="h-5 w-5" />
            Zobrazit plany
          </Button>
        </Link>
      </div>
    );
  }

  // Board game rows: 5 nodes per row, snake pattern
  function renderBoardRows(categoryLessons: typeof lessonsV2, colorKey: string) {
    const colors = COLOR_MAP[colorKey] || COLOR_MAP.blue;
    const rows: typeof lessonsV2[] = [];
    for (let i = 0; i < categoryLessons.length; i += 5) {
      rows.push(categoryLessons.slice(i, i + 5));
    }

    return rows.map((row, rowIdx) => {
      const isReversed = rowIdx % 2 === 1;
      const displayRow = isReversed ? [...row].reverse() : row;
      const isLastRow = rowIdx === rows.length - 1;

      return (
        <div key={rowIdx}>
          {/* Nodes row */}
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {displayRow.map((lesson, nodeIdx) => {
              const completed = isLessonCompleted(lesson.number, progress);
              const unlocked = isLessonUnlocked(lesson.number, progress);
              const bestScore = getBestScore(lesson.number, progress);
              const isCurrent = unlocked && !completed;

              return (
                <div key={lesson.number} className="flex items-center">
                  {/* Connector line (not before first node) */}
                  {nodeIdx > 0 && (
                    <div className={cn("h-0.5 w-3 sm:w-6", completed ? colors.nodeDone : colors.line)} />
                  )}
                  {/* Node */}
                  <button
                    onClick={() => unlocked ? router.push(`/dashboard/lekce/${lesson.number}`) : undefined}
                    disabled={!unlocked}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-xl border-2 w-14 h-14 sm:w-[72px] sm:h-[72px] transition-all",
                      completed
                        ? `${colors.nodeDone} border-transparent text-white shadow-md`
                        : isCurrent
                          ? `${colors.node} ring-2 ring-offset-2 ring-current shadow-lg cursor-pointer`
                          : unlocked
                            ? `${colors.node} cursor-pointer hover:shadow-md`
                            : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
                    )}
                    title={lesson.title}
                  >
                    {completed ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : !unlocked ? (
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <span className={cn("text-base sm:text-lg font-bold", isCurrent ? colors.text : "")}>
                        {String(lesson.number).padStart(2, "0")}
                      </span>
                    )}
                    {/* Score badge */}
                    {bestScore !== null && (
                      <span className={cn(
                        "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
                        completed ? "bg-white text-green-600" : "bg-white text-amber-600 border border-amber-300"
                      )}>
                        {bestScore}
                      </span>
                    )}
                    {/* Current pulse */}
                    {isCurrent && (
                      <span className={cn(
                        "absolute inset-0 rounded-xl animate-ping opacity-20",
                        colors.nodeDone
                      )} />
                    )}
                  </button>
                </div>
              );
            })}
            {/* Pad empty slots for incomplete rows */}
            {displayRow.length < 5 && Array.from({ length: 5 - displayRow.length }).map((_, i) => (
              <div key={`pad-${i}`} className="w-14 h-14 sm:w-[72px] sm:h-[72px]" />
            ))}
          </div>
          {/* Vertical connector to next row */}
          {!isLastRow && (
            <div className="flex" style={{ justifyContent: isReversed ? "flex-start" : "flex-end" }}>
              <div className={cn("w-0.5 h-6 mx-7 sm:mx-9", colors.line)} />
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <GraduationCap className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Lekce</h1>
            <p className="text-sm text-neutral-500">100 lekci z realitni praxe</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">{level.title}</p>
            <p className="text-xs text-neutral-500">{level.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-neutral-900">{completedCount}<span className="text-sm font-normal text-neutral-400">/100</span></p>
            <p className="text-xs text-neutral-500">{progressPct} % splneno</p>
          </div>
        </div>
        {/* Bar */}
        <div className="relative h-3 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        {/* Level markers */}
        <div className="flex justify-between mt-2">
          {PROGRESS_LEVELS.map((l, i) => (
            <span key={i} className={cn(
              "text-[10px] font-medium",
              progressPct >= l.min ? "text-primary-600" : "text-neutral-300"
            )}>
              {i === 0 ? l.title : i === PROGRESS_LEVELS.length - 1 ? l.title : ""}
            </span>
          ))}
        </div>
      </div>

      {/* Board game map */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const catLessons = lessonsByCategory[category];
          if (!catLessons || catLessons.length === 0) return null;
          const catConf = CATEGORY_CONFIG[category];
          const colors = COLOR_MAP[catConf?.color || "blue"];
          const IconComp = CATEGORY_ICONS[catConf?.icon || "Home"] || Home;
          const catCompleted = catLessons.filter((l) => isLessonCompleted(l.number, progress)).length;

          return (
            <div
              key={category}
              className={cn("rounded-xl border p-4 sm:p-5", colors.bg, colors.border)}
            >
              {/* Category header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colors.node)}>
                    <IconComp className={cn("h-4 w-4", colors.text)} />
                  </div>
                  <div>
                    <h2 className={cn("text-sm font-bold", colors.text)}>{category}</h2>
                    <p className="text-[11px] text-neutral-500">
                      {catCompleted}/{catLessons.length} splneno
                    </p>
                  </div>
                </div>
                {/* Mini progress */}
                <div className="w-20 h-1.5 rounded-full bg-white/60 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", colors.nodeDone)}
                    style={{ width: `${catLessons.length > 0 ? (catCompleted / catLessons.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Board rows */}
              <div className="space-y-1">
                {renderBoardRows(catLessons, catConf?.color || "blue")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Finish line */}
      <div className="mt-8 mb-12 text-center">
        <div className={cn(
          "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold",
          completedCount >= 100
            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg"
            : "bg-neutral-100 text-neutral-400"
        )}>
          <GraduationCap className="h-5 w-5" />
          {completedCount >= 100 ? "Elitni makler" : "Cil: Elitni makler"}
        </div>
      </div>
    </div>
  );
}
