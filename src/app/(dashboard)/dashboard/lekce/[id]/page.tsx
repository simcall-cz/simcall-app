"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Check,
  X,
  Loader2,
  Target,
  Lightbulb,
  GraduationCap,
  Phone,
  RotateCcw,
  Dumbbell,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/auth";
import { lessonsV2, CATEGORY_CONFIG } from "@/data/lessons-v2";
import type { LessonV2 } from "@/data/lessons-v2";
import Link from "next/link";

interface ProgressRecord {
  lesson_number: number;
  sub_scenario: number;
  attempt: number;
  score: number;
}

const DIM_LABELS: Record<string, string> = {
  legal: "Právní",
  communication: "Komunikační",
  process: "Procesní",
  emotional: "Emoční",
  financial: "Finanční",
};

const DIM_SHORT: Record<string, string> = {
  legal: "P",
  communication: "K",
  process: "R",
  emotional: "E",
  financial: "F",
};

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i <= level ? "bg-current" : "bg-neutral-300"
          )}
        />
      ))}
    </span>
  );
}

function isLessonCompleted(lessonNum: number, progress: ProgressRecord[]): boolean {
  const lp = progress.filter((p) => p.lesson_number === lessonNum);
  for (let sub = 1; sub <= 3; sub++) {
    const best = lp
      .filter((p) => p.sub_scenario === sub)
      .reduce((max, p) => Math.max(max, p.score), 0);
    if (best < 80) return false;
  }
  return lp.length > 0;
}

function isLessonUnlocked(lessonNum: number, progress: ProgressRecord[]): boolean {
  if (lessonNum === 1) return true;
  return isLessonCompleted(lessonNum - 1, progress);
}

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonNumber = Number(params.id);

  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrainingSuggestion, setShowTrainingSuggestion] = useState(false);

  const lesson = lessonsV2.find((l) => l.number === lessonNumber);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/lessons/progress", { headers });
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progress || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const unlocked = useMemo(() => isLessonUnlocked(lessonNumber, progress), [lessonNumber, progress]);
  const completed = useMemo(() => isLessonCompleted(lessonNumber, progress), [lessonNumber, progress]);

  // Per-sub-scenario stats
  const subStats = useMemo(() => {
    if (!lesson) return [];
    return lesson.subScenarios.map((sub) => {
      const attempts = progress
        .filter((p) => p.lesson_number === lessonNumber && p.sub_scenario === sub.number)
        .sort((a, b) => a.attempt - b.attempt);
      const bestScore = attempts.reduce((max, p) => Math.max(max, p.score), 0);
      const passed = bestScore >= 80;
      const consecutiveFails = getConsecutiveFails(attempts);
      return { sub, attempts, bestScore, passed, consecutiveFails };
    });
  }, [lesson, lessonNumber, progress]);

  // Check for 3 consecutive fails on any sub-scenario
  useEffect(() => {
    const hasTripleFail = subStats.some((s) => s.consecutiveFails >= 3 && !s.passed);
    if (hasTripleFail) setShowTrainingSuggestion(true);
  }, [subStats]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-neutral-500">Lekce nenalezena.</p>
        <Link href="/dashboard/lekce" className="mt-4 text-primary-500 hover:underline text-sm">
          Zpět na mapu
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 mb-4">
          <Lock className="h-8 w-8 text-neutral-400" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Lekce {lessonNumber} je zamčená</h1>
        <p className="text-neutral-500 mb-6">
          Nejprve splňte lekci {lessonNumber - 1} se skóre alespoň 80 % ve všech pod-scénářích.
        </p>
        <Link href="/dashboard/lekce">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zpět na mapu
          </Button>
        </Link>
      </div>
    );
  }

  const catConf = CATEGORY_CONFIG[lesson.category];
  const catColor = catConf?.color || "blue";

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-0">
      {/* Training suggestion modal */}
      <AnimatePresence>
        {showTrainingSuggestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowTrainingSuggestion(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Zkuste si nejdříve zatrénovat
                </h3>
              </div>
              <p className="text-sm text-neutral-600 mb-6">
                Na tomto pod-scénáři jste 3x po sobě nedosáhli 80 %. Doporučujeme přejít do volného tréninku,
                kde si můžete bez omezení procvičit podobné situace.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/trenink" className="flex-1">
                  <Button className="w-full gap-2">
                    <Dumbbell className="h-4 w-4" />
                    Přejít do tréninku
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setShowTrainingSuggestion(false)}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Zkusit znovu
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/lekce")}
        className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Zpět na mapu
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            `bg-${catColor}-100 text-${catColor}-700`
          )}>
            {lesson.category}
          </span>
          <span className="text-xs text-neutral-400">
            Lekce {lesson.number}/100
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              <Check className="h-3 w-3" />
              Splněno
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{lesson.title}</h1>
        <p className="text-sm text-neutral-500">{lesson.maxDifficulty}</p>
      </div>

      {/* 5 difficulty dimensions */}
      <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-white p-4">
        {Object.entries(lesson.dimensions).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 w-3">{DIM_SHORT[key]}</span>
            <DifficultyDots level={val} />
          </div>
        ))}
      </div>

      {/* Situation */}
      <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          Situace
        </h3>
        <p className="text-sm text-neutral-700 leading-relaxed">{lesson.situation}</p>
      </div>

      {/* Knowledge */}
      {lesson.knowledge.length > 0 && (
        <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Co musíte znát
          </h3>
          <ul className="space-y-2">
            {lesson.knowledge.map((k, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                <GraduationCap className="h-4 w-4 shrink-0 mt-0.5 text-primary-400" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Goal */}
      <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          Cíl hovoru
        </h3>
        <div className="flex items-start gap-2.5">
          <Target className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
          <p className="text-sm text-neutral-700">{lesson.goal}</p>
        </div>
      </div>

      {/* Tips */}
      {lesson.tips.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <h3 className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Tipy pro simulaci
          </h3>
          <ul className="space-y-1.5">
            {lesson.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="shrink-0 mt-0.5">-</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sub-scenarios */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-neutral-900 mb-2">
          3 pod-scénáře k absolvování
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Pro postup do další lekce je potřeba dosáhnout minimálně <strong className="text-neutral-700">80 %</strong> u každého ze 3 hovorů.
        </p>
        <div className="space-y-3">
          {subStats.map(({ sub, attempts, bestScore, passed, consecutiveFails }) => {
            const diffLabel = sub.difficulty;
            const totalAttempts = attempts.length;

            return (
              <div
                key={sub.number}
                className={cn(
                  "rounded-xl border p-4 sm:p-5 transition-all",
                  passed
                    ? "border-green-200 bg-green-50/40"
                    : "border-neutral-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        sub.number === 1
                          ? "bg-green-100 text-green-700"
                          : sub.number === 2
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      )}>
                        {diffLabel}
                      </span>
                      {passed && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm font-medium text-neutral-900">{sub.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">{sub.situation}</p>
                  </div>
                  {/* Score */}
                  {totalAttempts > 0 && (
                    <div className="text-right shrink-0">
                      <p className={cn(
                        "text-xl font-bold",
                        passed ? "text-green-600" : "text-amber-600"
                      )}>
                        {bestScore}%
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {totalAttempts} {totalAttempts === 1 ? "pokus" : totalAttempts < 5 ? "pokusy" : "pokusu"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Attempt history dots */}
                {totalAttempts > 0 && (
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-100">
                    <span className="text-[10px] text-neutral-400 mr-1">Pokusy:</span>
                    {attempts.map((a, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold",
                          a.score >= 80
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        )}
                        title={`Pokus ${a.attempt}: ${a.score}%`}
                      >
                        {a.score}
                      </span>
                    ))}
                  </div>
                )}

                {/* Consecutive fails warning */}
                {consecutiveFails >= 3 && !passed && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-700">
                      3x po sobě pod 80 %. Zvažte volný trénink.
                    </p>
                  </div>
                )}

                {/* Start button — placeholder, not connected to real agent */}
                {!passed && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 opacity-50 cursor-not-allowed"
                      disabled
                      title="Agenti pro lekce budou brzy k dispozici. Pro postup je potřeba min. 80 %."
                    >
                      <Phone className="h-4 w-4" />
                      Zahájit hovor (připravujeme)
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next lesson button */}
      {completed && lessonNumber < 100 && (
        <div className="mb-12 text-center">
          <Link href={`/dashboard/lekce/${lessonNumber + 1}`}>
            <Button size="lg" className="gap-2">
              Další lekce
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function getConsecutiveFails(attempts: ProgressRecord[]): number {
  let count = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].score < 80) count++;
    else break;
  }
  return count;
}
