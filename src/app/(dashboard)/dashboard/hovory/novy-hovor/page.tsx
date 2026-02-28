"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  ArrowLeft,
  Target,
  Clock,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ActiveCall } from "@/components/call/ActiveCall";
import { useTrainingCall } from "@/hooks/useTrainingCall";
import { scenarios } from "@/data/scenarios";
import { aiAgents } from "@/data/ai-agents";

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
  "cold-lead": "Studený lead",
  competitive: "Konkurence",
  negotiation: "Vyjednávání",
  listing: "Získání zakázky",
};

export default function NovyHovorPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "call">("select");

  const {
    phase,
    duration,
    isSpeaking,
    isMuted,
    error,
    callId,
    startCall,
    endCall,
    toggleMute,
    reset,
  } = useTrainingCall({
    onCallEnded: (id) => {
      console.log("Call ended:", id);
    },
  });

  const scenario = scenarios.find((s) => s.id === selectedScenario);
  const agent = scenario
    ? aiAgents.find((a) => a.id === scenario.agentId)
    : null;

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
      router.push(`/dashboard/hovory`);
    }
  };

  // CALL VIEW
  if (step === "call" && agent) {
    return (
      <div className="p-6">
        <ActiveCall
          phase={phase}
          duration={duration}
          agentName={agent.name}
          agentPersonality={agent.personality}
          agentInitials={agent.avatarInitials}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          error={error}
          onEndCall={endCall}
          onToggleMute={toggleMute}
          onReset={handleReset}
          onViewResults={handleViewResults}
        />
      </div>
    );
  }

  // CONFIRM VIEW
  if (step === "confirm" && scenario && agent) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <button
          onClick={() => setStep("select")}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět na výběr scénáře
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
        >
          {/* Header */}
          <div className="border-b border-neutral-100 bg-neutral-50 p-6">
            <Badge variant={difficultyConfig[scenario.difficulty].color}>
              {difficultyConfig[scenario.difficulty].label}
            </Badge>
            <h1 className="mt-3 text-2xl font-bold text-neutral-900">
              {scenario.title}
            </h1>
            <p className="mt-2 text-neutral-600">{scenario.description}</p>
          </div>

          {/* Agent Info */}
          <div className="border-b border-neutral-100 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Váš protějšek
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                <span className="text-lg font-bold text-primary-600">
                  {agent.avatarInitials}
                </span>
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{agent.name}</p>
                <p className="text-sm text-neutral-500">
                  {agent.personality}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {agent.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="border-b border-neutral-100 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Cíle hovoru
            </h3>
            <ul className="space-y-2">
              {scenario.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  <span className="text-sm text-neutral-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="border-b border-neutral-100 bg-amber-50/50 p-6">
            <h3 className="mb-2 text-sm font-semibold text-amber-800">
              💡 Tipy před hovorem
            </h3>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• Představte se profesionálně v prvních 10 sekundách</li>
              <li>• Poslouchejte pozorně a reagujte na potřeby klienta</li>
              <li>• Snažte se domluvit konkrétní schůzku</li>
              <li>• Vyhněte se výplňovým slovům (ehm, jako, vlastně)</li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="p-6">
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
        </motion.div>
      </div>
    );
  }

  // SELECT SCENARIO VIEW (default)
  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/hovory")}
          className="mb-4 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět na hovory
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">Nový hovor</h1>
        <p className="mt-2 text-neutral-500">
          Vyberte scénář pro tréninkový hovor s AI agentem
        </p>
      </div>

      {/* Difficulty Filter Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
          >
            {diff === "all"
              ? "Všechny"
              : difficultyConfig[diff].label}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((s, i) => {
          const a = aiAgents.find((ag) => ag.id === s.agentId);
          const diffConf = difficultyConfig[s.difficulty];
          const DiffIcon = diffConf.icon;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="cursor-pointer transition-all hover:border-primary-200 hover:shadow-md"
                onClick={() => handleSelectScenario(s.id)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={diffConf.color} className="gap-1">
                          <DiffIcon className="h-3 w-3" />
                          {diffConf.label}
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          {categoryLabels[s.category] || s.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {s.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                        {s.description}
                      </p>
                    </div>
                    <ChevronRight className="ml-3 h-5 w-5 shrink-0 text-neutral-300" />
                  </div>

                  {/* Agent preview */}
                  {a && (
                    <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                        <span className="text-xs font-bold text-neutral-600">
                          {a.avatarInitials}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          {a.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {a.personality}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
