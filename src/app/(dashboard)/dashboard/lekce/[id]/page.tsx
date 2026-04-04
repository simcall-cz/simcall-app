"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Check,
  Loader2,
  Lightbulb,
  GraduationCap,
  Phone,
  RotateCcw,
  Dumbbell,
  AlertTriangle,
  Trophy,
  ChevronRight,
  ChevronDown,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/auth";
import { CATEGORY_CONFIG, TIER_CONFIG } from "@/lib/lessons";
import { ActiveCall } from "@/components/call/ActiveCall";
import { useTrainingCall } from "@/hooks/useTrainingCall";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Link from "next/link";

interface ProgressRecord {
  lesson_number: number;
  sub_scenario: number;
  attempt: number;
  score: number;
}

interface LessonRow {
  id: string;
  lesson_number: number;
  title_cs: string;
  category: string;
  skills_tested: string[];
  knowledge_snippets: string[];
}

interface AgentRow {
  id: string;
  name: string;
  persona_name: string | null;
  tier: "beginner" | "intermediate" | "advanced";
  difficulty_overall: number | null;
  archetype: string | null;
  traits: string[] | null;
  avatar_initials: string | null;
  elevenlabs_agent_id: string | null;
}

const TIER_ORDER: ("beginner" | "intermediate" | "advanced")[] = ["beginner", "intermediate", "advanced"];

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  intermediate: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  advanced: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

function isLessonCompleted(lessonNum: number, progress: ProgressRecord[]): boolean {
  const lp = progress.filter((p) => p.lesson_number === lessonNum);
  for (let sub = 1; sub <= 3; sub++) {
    const best = lp.filter((p) => p.sub_scenario === sub).reduce((max, p) => Math.max(max, p.score), 0);
    if (best < 80) return false;
  }
  return lp.length > 0;
}

function getConsecutiveFails(attempts: ProgressRecord[]): number {
  let count = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].score < 80) count++;
    else break;
  }
  return count;
}

function LessonDetailContent() {
  const params = useParams();
  const router = useRouter();
  const lessonNumber = Number(params.id);

  const [lesson, setLesson] = useState<LessonRow | null>(null);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [allLessons, setAllLessons] = useState<LessonRow[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState<AgentRow | null>(null);
  const [activeSubScenario, setActiveSubScenario] = useState<number>(0);
  const [showTrainingSuggestion, setShowTrainingSuggestion] = useState(false);
  const [expandedAttempts, setExpandedAttempts] = useState<Record<number, boolean>>({});

  const callHook = useTrainingCall({
    onCallEnded: async (callId) => {
      if (callHook.processingResult && activeSubScenario > 0) {
        try {
          const headers = await getAuthHeaders();
          await fetch("/api/lessons/progress", {
            method: "POST",
            headers,
            body: JSON.stringify({
              lessonNumber,
              subScenario: activeSubScenario,
              score: callHook.processingResult.overall_score,
              callId,
              topicId: lesson?.id,
              tier: activeAgent?.tier,
            }),
          });
          fetchProgress();
        } catch (e) {
          console.error("Failed to save lesson progress:", e);
        }
      }
    },
  });

  const fetchProgress = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/lessons/progress", { headers });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const headers = await getAuthHeaders();
        const [progressRes, lessonsRes] = await Promise.all([
          fetch("/api/lessons/progress", { headers }),
          fetch("/api/lessons"),
        ]);

        if (progressRes.ok) {
          const data = await progressRes.json();
          setProgress(data.progress || []);
        }

        if (lessonsRes.ok) {
          const lessonsData: LessonRow[] = await lessonsRes.json();
          setAllLessons(lessonsData);
          const currentLesson = lessonsData.find((l) => l.lesson_number === lessonNumber);
          setLesson(currentLesson || null);

          // Fetch agents for this lesson's topic_id
          if (currentLesson) {
            const agentsRes = await fetch(
              `/api/agents?topic_id=${currentLesson.id}&status=approved`
            );
            if (agentsRes.ok) {
              const agentsData = await agentsRes.json();
              setAgents(agentsData || []);
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [lessonNumber, fetchProgress]);

  // Category lessons for unlock logic
  const categoryLessons = useMemo(() => {
    if (!lesson) return [];
    return allLessons.filter((l) => l.category === lesson.category);
  }, [allLessons, lesson]);

  const unlocked = useMemo(() => {
    if (!lesson) return false;
    const idx = categoryLessons.findIndex((l) => l.lesson_number === lesson.lesson_number);
    if (idx <= 0) return true;
    return isLessonCompleted(categoryLessons[idx - 1].lesson_number, progress);
  }, [lesson, categoryLessons, progress]);

  const completed = useMemo(() => isLessonCompleted(lessonNumber, progress), [lessonNumber, progress]);

  // Per-agent stats (sub_scenario 1=beginner, 2=intermediate, 3=advanced)
  const agentStats = useMemo(() => {
    return TIER_ORDER.map((tier, idx) => {
      const subNum = idx + 1;
      const agent = agents.find((a) => a.tier === tier) || null;
      const attempts = progress
        .filter((p) => p.lesson_number === lessonNumber && p.sub_scenario === subNum)
        .sort((a, b) => a.attempt - b.attempt);
      const bestScore = attempts.reduce((max, p) => Math.max(max, p.score), 0);
      const passed = bestScore >= 80;
      const totalAttempts = attempts.length;
      return { agent, tier, subNum, attempts, bestScore, passed, totalAttempts };
    });
  }, [agents, lessonNumber, progress]);

  const passedCount = agentStats.filter((s) => s.passed).length;
  const remainingCount = 3 - passedCount;

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

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

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 mb-4">
          <Lock className="h-8 w-8 text-neutral-400" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Lekce je zamčená</h1>
        <p className="text-neutral-500 mb-6">
          Nejprve splňte předchozí lekci v této kategorii se skóre alespoň 80 % ve všech 3 hovorech.
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

  // If a call is active, show ActiveCall
  if (callHook.phase !== "idle" && activeAgent) {
    const agentDisplayName = activeAgent.persona_name || activeAgent.name;
    const tierLabel = TIER_CONFIG[activeAgent.tier]?.label || "";

    return (
      <div className="max-w-3xl mx-auto px-2 sm:px-0">
        <ActiveCall
          phase={callHook.phase}
          duration={callHook.duration}
          agentName={agentDisplayName}
          agentPersonality={tierLabel}
          agentInitials={activeAgent.avatar_initials || agentDisplayName.slice(0, 2).toUpperCase()}
          userInitials="JA"
          isSpeaking={callHook.isSpeaking}
          isMuted={callHook.isMuted}
          error={callHook.error}
          processingResult={callHook.processingResult}
          onEndCall={callHook.endCall}
          onToggleMute={callHook.toggleMute}
          onReset={() => {
            callHook.reset();
            setActiveAgent(null);
            setActiveSubScenario(0);
            fetchProgress();
          }}
          onViewResults={() => {
            const currentCallId = callHook.callId;
            if (callHook.processingResult && activeSubScenario > 0) {
              getAuthHeaders().then((headers) => {
                fetch("/api/lessons/progress", {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    lessonNumber,
                    subScenario: activeSubScenario,
                    score: callHook.processingResult!.overall_score,
                    callId: currentCallId,
                    topicId: lesson?.id,
                    tier: activeAgent?.tier,
                  }),
                }).then(() => fetchProgress());
              });
            }
            if (currentCallId) {
              router.push(`/dashboard/hovory?detail=${currentCallId}`);
            } else {
              callHook.reset();
              setActiveAgent(null);
              setActiveSubScenario(0);
              fetchProgress();
            }
          }}
        />
      </div>
    );
  }

  const catConf = CATEGORY_CONFIG[lesson.category];
  const nextLessonIdx = categoryLessons.findIndex((l) => l.lesson_number === lessonNumber) + 1;
  const nextLesson = nextLessonIdx < categoryLessons.length ? categoryLessons[nextLessonIdx] : null;
  const catComplete = categoryLessons.every((l) => isLessonCompleted(l.lesson_number, progress));

  const handleStartCall = async (agent: AgentRow, subNum: number) => {
    if (!agent.elevenlabs_agent_id && !agent.id) return;
    setActiveAgent(agent);
    setActiveSubScenario(subNum);
    await callHook.startCall(agent.elevenlabs_agent_id || agent.id, `lesson-${lessonNumber}-${subNum}`);
  };

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
                Na tomto hovoru jste 3× po sobě nedosáhli 80 %. Doporučujeme přejít do volného tréninku.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/hovory/novy-hovor" className="flex-1">
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
            `bg-${catConf?.color || "blue"}-100 text-${catConf?.color || "blue"}-700`
          )}>
            {catConf?.label || lesson.category}
          </span>
          <span className="text-xs text-neutral-400">
            Lekce {categoryLessons.findIndex((l) => l.lesson_number === lessonNumber) + 1}/{categoryLessons.length}
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              <Check className="h-3 w-3" />
              Splněno
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{lesson.title_cs}</h1>
      </div>

      {/* Knowledge snippets */}
      {lesson.knowledge_snippets && lesson.knowledge_snippets.length > 0 && (
        <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Co musíte znát
          </h3>
          <ul className="space-y-2">
            {lesson.knowledge_snippets.map((k, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                <GraduationCap className="h-4 w-4 shrink-0 mt-0.5 text-primary-400" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills tested */}
      {lesson.skills_tested && lesson.skills_tested.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <h3 className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Testované dovednosti
          </h3>
          <ul className="space-y-1.5">
            {lesson.skills_tested.map((skill, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="shrink-0 mt-0.5">-</span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress summary */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900">3 hovory k absolvování</h3>
        {remainingCount > 0 && !completed ? (
          <span className="text-xs text-neutral-500">
            Zbývá dokončit: <strong className="text-neutral-700">{remainingCount}</strong>
          </span>
        ) : completed ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <Trophy className="h-3.5 w-3.5" />
            Lekce dokončena!
          </span>
        ) : null}
      </div>

      <p className="text-xs text-neutral-500 mb-4">
        Pro postup do další lekce je potřeba dosáhnout minimálně <strong className="text-neutral-700">80 %</strong> u každého ze 3 hovorů.
      </p>

      {/* Agent cards */}
      <div className="space-y-3 mb-8">
        {agentStats.map(({ agent, tier, subNum, attempts, bestScore, passed, totalAttempts }) => {
          const colors = TIER_COLORS[tier] || TIER_COLORS.beginner;
          const tierConf = TIER_CONFIG[tier];
          const consecutiveFails = getConsecutiveFails(attempts);
          const agentName = agent?.persona_name || agent?.name || `Agent ${tier}`;
          const initials = agent?.avatar_initials || agentName.slice(0, 2).toUpperCase();

          return (
            <motion.div
              key={subNum}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: subNum * 0.1 }}
              className={cn(
                "rounded-xl border p-5 transition-all",
                passed ? "border-green-200 bg-green-50/40" : colors.border, colors.bg
              )}
            >
              {/* Agent header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    passed ? "bg-green-500 text-white" : `${colors.bg} ${colors.text} border ${colors.border}`
                  )}>
                    {passed ? <Check className="h-5 w-5" /> : initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-900 leading-tight">{agentName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        passed ? "bg-green-100 text-green-700" : `${colors.bg} ${colors.text}`
                      )}>
                        {tierConf?.label || tier}
                      </span>
                      {agent?.difficulty_overall && (
                        <span className="text-[10px] text-neutral-400">
                          Obtížnost {agent.difficulty_overall.toFixed(1)}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {totalAttempts > 0 && (
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-xl font-bold",
                      passed ? "text-green-600" : bestScore >= 60 ? "text-amber-600" : "text-red-500"
                    )}>
                      {bestScore}%
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {totalAttempts} {totalAttempts === 1 ? "pokus" : totalAttempts < 5 ? "pokusy" : "pokusů"}
                    </p>
                  </div>
                )}
              </div>

              {/* Mini progress bar */}
              <div className="mb-3">
                <div className="relative h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-[80%] w-px bg-neutral-300 z-10" />
                  {totalAttempts > 0 && (
                    <motion.div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full",
                        passed
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : bestScore >= 60
                            ? "bg-gradient-to-r from-amber-400 to-amber-500"
                            : "bg-gradient-to-r from-red-400 to-red-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(bestScore, 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-neutral-400">0</span>
                  <span className="text-[9px] text-neutral-400 ml-auto mr-[18%]">80</span>
                  <span className="text-[9px] text-neutral-400">100</span>
                </div>
              </div>

              {passed && (
                <div className="flex items-center gap-2 mb-3 rounded-lg bg-green-100 px-3 py-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Dokončeno</span>
                </div>
              )}

              {/* Attempt history */}
              {totalAttempts > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => setExpandedAttempts((prev) => ({ ...prev, [subNum]: !prev[subNum] }))}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Poslední pokusy ({totalAttempts})</span>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      expandedAttempts[subNum] && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {expandedAttempts[subNum] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-1.5">
                          {attempts.slice(-10).reverse().map((a, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-3 py-2 text-xs",
                                a.score >= 80
                                  ? "bg-green-50 border border-green-100"
                                  : "bg-red-50 border border-red-100"
                              )}
                            >
                              <span className="text-neutral-600">Pokus {a.attempt}</span>
                              <span className={cn("font-bold", a.score >= 80 ? "text-green-700" : "text-red-600")}>
                                {a.score} %
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {consecutiveFails >= 3 && !passed && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700">3× po sobě pod 80 %. Zvažte volný trénink.</p>
                </div>
              )}

              {!passed && agent && (
                <Button
                  onClick={() => handleStartCall(agent, subNum)}
                  className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                >
                  <Phone className="h-4 w-4" />
                  Zavolat
                </Button>
              )}

              {passed && agent && (
                <Button
                  onClick={() => handleStartCall(agent, subNum)}
                  variant="outline"
                  className="w-full gap-2 text-neutral-500 hover:text-neutral-700"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Zavolat znovu
                </Button>
              )}

              {!agent && (
                <p className="text-xs text-neutral-400 text-center py-2">Agent zatím není dostupný</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lesson completed → next lesson or category done */}
      {completed && (
        <div className="mb-12 text-center">
          {catComplete ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 mb-4">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-800 mb-1">
                Kategorie {catConf?.label || lesson.category} dokončena!
              </h3>
              <p className="text-sm text-green-600">
                Gratulujeme! Zvládli jste všechny lekce v této kategorii.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 mb-4">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-800 mb-1">Lekce splněna!</h3>
              <p className="text-sm text-green-600">
                Další lekce v kategorii {catConf?.label || lesson.category} je odemčena.
              </p>
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            {nextLesson && (
              <Link href={`/dashboard/lekce/${nextLesson.lesson_number}`}>
                <Button size="lg" className="gap-2">
                  Další lekce
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="/dashboard/lekce">
              <Button size="lg" variant="outline" className="gap-2">
                Zpět na přehled
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonDetailPage() {
  return (
    <ErrorBoundary>
      <LessonDetailContent />
    </ErrorBoundary>
  );
}
