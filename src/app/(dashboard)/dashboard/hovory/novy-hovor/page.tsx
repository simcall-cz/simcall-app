"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  ArrowLeft,
  Target,
  Shield,
  Zap,
  Flame,
  ChevronRight,
  Loader2,
  ZoomIn,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ActiveCall } from "@/components/call/ActiveCall";
import { useTrainingCall } from "@/hooks/useTrainingCall";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { AIAgent, Scenario } from "@/types";

const difficultyConfig = {
  easy: {
    label: "Začátečník",
    color: "success" as const,
    icon: Zap,
  },
  medium: {
    label: "Pokročilý",
    color: "warning" as const,
    icon: Shield,
  },
  hard: {
    label: "Expert",
    color: "default" as const,
    icon: Flame,
  },
};

const categoryLabels: Record<string, string> = {
  "hot-lead": "Horký lead",
  "warm-lead": "Teplý lead",
  "cold-lead": "Studený lead",
  "competitive": "Konkurence",
  "negotiation": "Vyjednávání",
  "listing": "Získání zakázky",
};

export default function NovyHovorPage() {
  const router = useRouter();

  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "call">("select");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [imageZoom, setImageZoom] = useState(false);

  const {
    phase,
    duration,
    isSpeaking,
    isMuted,
    error: callError,
    callId,
    processingResult,
    startCall,
    endCall,
    toggleMute,
    reset,
  } = useTrainingCall({
    onCallEnded: (id) => {
      console.log("Call ended:", id);
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, scenariosRes] = await Promise.all([
          supabase.from("agents").select("*").not("elevenlabs_agent_id", "is", null),
          supabase.from("scenarios").select("*")
        ]);

        if (agentsRes.data) {
          const formattedAgents: AIAgent[] = agentsRes.data.map((a: any) => ({
            id: a.id,
            name: a.name,
            personality: a.personality,
            description: a.description || "",
            difficulty: a.difficulty as any,
            avatarInitials: a.avatar_initials,
            traits: a.traits || [],
            exampleScenario: a.example_scenario || ""
          }));
          setAgents(formattedAgents);
        }

        if (scenariosRes.data) {
          const formattedScenarios: Scenario[] = scenariosRes.data.map((s: any) => {
            return {
              id: s.id,
              title: s.title,
              description: s.description || "",
              category: s.category as any,
              difficulty: s.difficulty as any,
              objectives: s.objectives || [],
              agentId: s.agent_id,
              imageUrl: s.image_url || "",
              tips: s.tips || []
            };
          });
          setScenarios(formattedScenarios);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  const scenario = scenarios.find((s) => s.id === selectedScenario);
  const agent = scenario ? agents.find((a) => a.id === scenario.agentId) : null;

  const filteredScenarios = selectedDifficulty === "all"
    ? scenarios
    : scenarios.filter((s) => s.difficulty === selectedDifficulty);

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setStep("confirm");
  };

  const handleStartCall = async () => {
    if (!scenario || !agent) return;
    setStep("call");
    await startCall(agent.id, scenario.id);
  };

  const handleReset = () => {
    reset();
    setStep("select");
    setSelectedScenario(null);
  };

  const handleViewResults = () => {
    if (callId) {
      router.push("/dashboard/hovory");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // CALL VIEW
  if (step === "call" && agent) {
    return (
      <div className="p-2 sm:p-6">
        <ActiveCall
          phase={phase}
          duration={duration}
          agentName={agent.name}
          agentPersonality={agent.personality}
          agentInitials={agent.avatarInitials}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          error={callError}
          processingResult={processingResult}
          onEndCall={endCall}
          onToggleMute={toggleMute}
          onReset={handleReset}
          onViewResults={handleViewResults}
        />
      </div>
    );
  }

  // CONFIRM VIEW — 2-column layout on desktop
  if (step === "confirm" && scenario && agent) {
    const diffConf = difficultyConfig[scenario.difficulty] || difficultyConfig.medium;
    const hasTips = scenario.tips && scenario.tips.length > 0;
    const defaultTips = [
      "Představte se profesionálně v prvních 10 sekundách",
      "Poslouchejte pozorně a reagujte na potřeby klienta",
      "Snažte se domluvit konkrétní schůzku",
      "Ujistěte se, že chápete kontext z popisu výše",
    ];
    const tipsToShow = hasTips ? scenario.tips! : defaultTips;

    return (
      <div className="mx-auto max-w-6xl px-2 sm:px-6">
        <button
          onClick={() => setStep("select")}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět na výběr scénáře
        </button>

        {/* Lightbox */}
        {imageZoom && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setImageZoom(false)}
          >
            <button
              onClick={() => setImageZoom(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={scenario.imageUrl}
              alt={`Kontext: ${scenario.title}`}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mobile-only header */}
          <div className="lg:hidden mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={diffConf.color}>
                {diffConf.label}
              </Badge>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                {categoryLabels[scenario.category] || scenario.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {scenario.title}
            </h1>
            <p className="mt-2 text-neutral-600 whitespace-pre-wrap">{scenario.description}</p>
          </div>

          {/* Two-column grid */}
          <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-8">

            {/* LEFT COLUMN — sticky on desktop */}
            <div className="lg:sticky lg:top-6 lg:self-start space-y-5">
              {/* Agent card with image */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                {/* Scenario Image */}
                {scenario.imageUrl && (
                  <div
                    className="group relative cursor-pointer"
                    onClick={() => setImageZoom(true)}
                  >
                    <img
                      src={scenario.imageUrl}
                      alt={`Kontext: ${scenario.title}`}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                      <div className="rounded-full bg-white/80 p-2 opacity-0 shadow transition-opacity group-hover:opacity-100">
                        <ZoomIn className="h-5 w-5 text-neutral-700" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Agent Info */}
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Váš protějšek
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50">
                      <span className="text-base font-bold text-primary-600">
                        {agent.avatarInitials}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 break-words leading-tight">{agent.name}</p>
                      <p className="text-sm text-neutral-500 break-words">
                        {agent.personality}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {agent.traits?.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Button — desktop (always visible due to sticky) */}
              <div className="hidden lg:block">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleStartCall}
                >
                  <Phone className="h-5 w-5" />
                  Zahájit hovor
                </Button>
                <p className="mt-3 text-center text-xs text-neutral-400">
                  Hovor bude nahráván a analyzován pro zpětnou vazbu
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="mt-6 lg:mt-0">
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                {/* Header — desktop only */}
                <div className="hidden lg:block border-b border-neutral-100 bg-neutral-50 p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={diffConf.color}>
                      {diffConf.label}
                    </Badge>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {categoryLabels[scenario.category] || scenario.category}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {scenario.title}
                  </h1>
                  <p className="mt-2 text-neutral-600 whitespace-pre-wrap">{scenario.description}</p>
                </div>

                {/* Mobile-only: agent info + image (already shown in left column on desktop) */}
                <div className="lg:hidden">
                  {/* Agent Info */}
                  <div className="border-b border-neutral-100 p-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Váš protějšek
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50">
                        <span className="text-base font-bold text-primary-600">
                          {agent.avatarInitials}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-neutral-900 break-words leading-tight">{agent.name}</p>
                        <p className="text-sm text-neutral-500 break-words">
                          {agent.personality}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {agent.traits?.map((trait) => (
                        <span
                          key={trait}
                          className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  {scenario.imageUrl && (
                    <div className="border-b border-neutral-100 p-5">
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Kontext leadu
                      </h3>
                      <div
                        className="group relative cursor-pointer rounded-xl overflow-hidden border border-neutral-200/60 bg-white shadow-sm"
                        onClick={() => setImageZoom(true)}
                      >
                        <img
                          src={scenario.imageUrl}
                          alt={`Kontext: ${scenario.title}`}
                          className="w-full h-auto object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                          <div className="rounded-full bg-white/80 p-2 opacity-0 shadow transition-opacity group-hover:opacity-100">
                            <ZoomIn className="h-5 w-5 text-neutral-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Objectives */}
                <div className="border-b border-neutral-100 p-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                    Cíle hovoru
                  </h3>
                  <ul className="space-y-2.5">
                    {scenario.objectives?.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                        <span className="text-sm text-neutral-700">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Tips */}
                <div className="bg-amber-50/50 p-6">
                  <h3 className="mb-3 text-sm font-semibold text-amber-800">
                    💡 Tipy před hovorem
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-700">
                    {tipsToShow.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Start Button — mobile only */}
              <div className="lg:hidden mt-6">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleStartCall}
                >
                  <Phone className="h-5 w-5" />
                  Zahájit hovor
                </Button>
                <p className="mt-3 text-center text-xs text-neutral-400">
                  Hovor bude nahráván a analyzován pro zpětnou vazbu
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // SELECT SCENARIO VIEW (default)
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => router.push("/dashboard/hovory")}
          className="mb-3 sm:mb-4 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět na hovory
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Nový hovor</h1>
        <p className="mt-2 text-neutral-500">
          Vyberte scénář pro tréninkový hovor. K dispozici je {filteredScenarios.length} agentů pro různé situace z praxe.
        </p>
      </div>

      {/* Difficulty Filter Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              selectedDifficulty === diff
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
            )}
          >
            {diff === "all"
              ? "Všechny"
              : difficultyConfig[diff].label}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredScenarios.map((s, i) => {
          const a = agents.find((ag) => ag.id === s.agentId);
          if (!a) return null;

          const diffConf = difficultyConfig[s.difficulty] || difficultyConfig.medium;
          const DiffIcon = diffConf.icon;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 10) * 0.05 }}
              className="h-full"
            >
              <Card
                className="cursor-pointer h-full flex flex-col transition-all hover:border-primary-200 hover:shadow-md overflow-hidden"
                onClick={() => handleSelectScenario(s.id)}
              >
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant={diffConf.color} className="gap-1">
                          <DiffIcon className="h-3 w-3" />
                          {diffConf.label}
                        </Badge>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                          {categoryLabels[s.category] || s.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 leading-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                        {s.description.split('\\n')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1"></div>

                  {/* Agent preview - Fixed truncation */}
                  <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <div className="flex items-center gap-3 w-full pr-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                        <span className="text-xs font-bold text-neutral-600">
                          {a.avatarInitials}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 break-words leading-tight line-clamp-2">
                          {a.name}
                        </p>
                        <p className="text-xs text-neutral-500 break-words mt-1 leading-tight line-clamp-2">
                          {a.personality}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-dashed border-neutral-200">
          <p className="text-neutral-500">Nenalezeny žádné scénáře s touto obtížností.</p>
        </div>
      )}
    </div>
  );
}
