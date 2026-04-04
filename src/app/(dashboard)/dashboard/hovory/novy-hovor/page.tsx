"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  Phone,
  ArrowLeft,
  ChevronRight,
  Loader2,
  Lock,
  Zap,
  Shield,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActiveCall } from "@/components/call/ActiveCall";
import { useTrainingCall } from "@/hooks/useTrainingCall";
import { supabase } from "@/lib/supabase";
import { getAuthHeaders } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG, TIER_CONFIG, CATEGORIES, TIERS } from "@/lib/lessons";

interface V3Agent {
  id: string;
  name: string;
  persona_name: string | null;
  personality: string;
  description: string;
  topic_id: string | null;
  tier: "beginner" | "intermediate" | "advanced" | null;
  difficulty_overall: number | null;
  archetype: string | null;
  traits: string[] | null;
  avatar_initials: string | null;
  elevenlabs_agent_id: string | null;
  category: string | null;
  status: string | null;
  // Joined lesson data
  lessons?: { title_cs: string; category: string; lesson_number: number } | null;
}

const tierConfig = {
  beginner:     { label: TIER_CONFIG.beginner.label,     color: "success" as const, icon: Zap,    borderColor: "border-l-green-400",  bgTint: "bg-green-50/40"  },
  intermediate: { label: TIER_CONFIG.intermediate.label,  color: "warning" as const, icon: Shield, borderColor: "border-l-amber-400",  bgTint: "bg-amber-50/40"  },
  advanced:     { label: TIER_CONFIG.advanced.label,      color: "default" as const, icon: Flame,  borderColor: "border-l-red-400",    bgTint: "bg-red-50/40"    },
};

const filterChipColors: Record<string, string> = {
  all: "border-primary-500 bg-primary-50 text-primary-600",
  beginner: "border-green-500 bg-green-50 text-green-700",
  intermediate: "border-amber-500 bg-amber-50 text-amber-700",
  advanced: "border-red-500 bg-red-50 text-red-700",
};

function NovyHovorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentIdParam = searchParams.get("agentId");

  const [agents, setAgents] = useState<V3Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxDurationSeconds, setMaxDurationSeconds] = useState<number | undefined>();
  const [userInitials, setUserInitials] = useState("U");

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "call">("select");
  const [selectedTier, setSelectedTier] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Auto-select agent if provided in URL
  useEffect(() => {
    if (agentIdParam && agents.length > 0) {
      const exists = agents.find(a => a.id === agentIdParam);
      if (exists && !selectedAgentId) {
        setSelectedAgentId(agentIdParam);
        setStep("confirm");
      }
    }
  }, [agentIdParam, agents, selectedAgentId]);

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
    maxDurationSeconds,
    onCallEnded: (id) => {
      console.log("Call ended:", id);
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch V3 agents with joined lesson data
        const { data: agentsData } = await supabase
          .from("agents")
          .select("*, lessons!left(title_cs, category, lesson_number)")
          .not("elevenlabs_agent_id", "is", null)
          .eq("status", "approved")
          .not("topic_id", "is", null)
          .order("difficulty_overall", { ascending: true });

        if (agentsData) {
          setAgents(agentsData as V3Agent[]);
        }

        // Fallback: if no V3 agents, fetch all agents (old system)
        if (!agentsData || agentsData.length === 0) {
          const { data: fallbackAgents } = await supabase
            .from("agents")
            .select("*")
            .not("elevenlabs_agent_id", "is", null)
            .order("created_at", { ascending: true });

          if (fallbackAgents) {
            setAgents(fallbackAgents as V3Agent[]);
          }
        }

        // Fetch subscription info
        try {
          const headers = await getAuthHeaders();
          const subscriptionRes = await fetch("/api/subscription", { headers });
          if (subscriptionRes.ok) {
            const subData = await subscriptionRes.json();
            const limit = subData.minutesLimit || 0;
            const used = subData.minutesUsed || 0;
            const remainingMinutes = Math.max(0, limit - used);
            setMaxDurationSeconds(remainingMinutes * 60);
            if (!subData || subData.error || subData.plan === "demo") {
              setIsDemoUser(true);
            }
          }
        } catch {
          console.warn("Could not fetch subscription info");
        }

        // Fetch user initials
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || "";
          const parts = fullName.trim().split(/\s+/);
          const initials = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (fullName.slice(0, 2) || "U").toUpperCase();
          setUserInitials(initials);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const agent = agents.find((a) => a.id === selectedAgentId);

  // Filter agents by tier and category
  let filteredAgents = agents;
  if (selectedTier !== "all") {
    filteredAgents = filteredAgents.filter((a) => a.tier === selectedTier);
  }
  if (selectedCategory) {
    filteredAgents = filteredAgents.filter((a) => {
      const cat = a.lessons?.category || a.category;
      return cat === selectedCategory;
    });
  }

  // Demo users see limited agents
  const DEMO_AGENT_LIMIT = 5;
  const allFilteredCount = filteredAgents.length;
  if (isDemoUser) {
    filteredAgents = filteredAgents.slice(0, DEMO_AGENT_LIMIT);
  }

  // Unique categories from available agents
  const availableCategories = [...new Set(agents.map((a) => a.lessons?.category || a.category).filter(Boolean))];

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setStep("confirm");
  };

  const handleStartCall = async () => {
    if (!agent) return;
    setStep("call");
    await startCall(agent.id, agent.id);
  };

  const handleReset = () => {
    reset();
    setStep("select");
    setSelectedAgentId(null);
  };

  const handleViewResults = () => {
    if (callId) {
      router.push(`/dashboard/hovory?detail=${callId}`);
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
    const agentName = agent.persona_name || agent.name;
    return (
      <div className="p-2 sm:p-6">
        <ActiveCall
          phase={phase}
          duration={duration}
          agentName={agentName}
          agentPersonality={agent.personality || agent.archetype || ""}
          agentInitials={agent.avatar_initials || agentName.slice(0, 2).toUpperCase()}
          userInitials={userInitials}
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

  // CONFIRM VIEW
  if (step === "confirm" && agent) {
    const agentName = agent.persona_name || agent.name;
    const agentTier = agent.tier || "intermediate";
    const tConf = tierConfig[agentTier] || tierConfig.intermediate;
    const TierIcon = tConf.icon;
    const lessonTitle = agent.lessons?.title_cs || agent.description || "";
    const catKey = agent.lessons?.category || agent.category || "";
    const catConf = CATEGORY_CONFIG[catKey];

    return (
      <div className="mx-auto max-w-3xl px-2 sm:px-6">
        <button
          onClick={() => setStep("select")}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět na výběr
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b border-neutral-100 bg-neutral-50 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant={tConf.color}>
                  <TierIcon className="h-3 w-3 mr-1" />
                  {tConf.label}
                </Badge>
                {catConf && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {catConf.label}
                  </span>
                )}
                {agent.difficulty_overall && (
                  <span className="text-xs text-neutral-400">
                    Obtížnost {agent.difficulty_overall.toFixed(1)}/10
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">{lessonTitle}</h1>
            </div>

            {/* Agent Info */}
            <div className="border-b border-neutral-100 p-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Váš protějšek
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50">
                  <span className="text-base font-bold text-primary-600">
                    {agent.avatar_initials || agentName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{agentName}</p>
                  <p className="text-sm text-neutral-500">
                    {agent.archetype || agent.personality}
                  </p>
                </div>
              </div>
              {agent.traits && agent.traits.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {agent.traits.map((trait) => (
                    <span key={trait} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Start Button */}
            <div className="p-6">
              <Button size="lg" className="w-full gap-2" onClick={handleStartCall}>
                <Phone className="h-5 w-5" />
                Zahájit hovor
              </Button>
              <p className="mt-3 text-center text-xs text-neutral-400">
                Hovor bude nahráván a analyzován pro zpětnou vazbu
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // SELECT AGENT VIEW (default)
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
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Trénink</h1>
        <p className="mt-2 text-neutral-500">
          Vyberte agenta a trénujte s AI. K dispozici je {agents.length} agentů pro různé situace z praxe.
        </p>
      </div>

      {/* Tier Filter Chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", ...TIERS] as const).map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier as typeof selectedTier)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              selectedTier === tier
                ? filterChipColors[tier] || filterChipColors.all
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
            )}
          >
            {tier === "all" ? "Všechny" : TIER_CONFIG[tier].label}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            !selectedCategory
              ? "border-primary-300 bg-primary-50 text-primary-700"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
          )}
        >
          Vše
        </button>
        {CATEGORIES.filter((cat) => availableCategories.includes(cat)).map((cat) => {
          const conf = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                selectedCategory === cat
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              )}
            >
              {conf?.label || cat}
            </button>
          );
        })}
      </div>

      {/* Agents List */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden divide-y divide-neutral-100">
        {filteredAgents.map((a, i) => {
          const agentName = a.persona_name || a.name;
          const agentTier = a.tier || "intermediate";
          const tConf = tierConfig[agentTier] || tierConfig.intermediate;
          const TierIcon = tConf.icon;
          const catKey = a.lessons?.category || a.category || "";
          const catConf = CATEGORY_CONFIG[catKey];

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (i % 20) * 0.02 }}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors hover:bg-neutral-50 group",
                "border-l-3",
                tConf.borderColor
              )}
              onClick={() => handleSelectAgent(a.id)}
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition-colors">
                <span className="text-xs font-bold text-neutral-600">
                  {a.avatar_initials || agentName.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Main info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{agentName}</p>
                  <Badge variant={tConf.color} className="gap-1 px-2 py-0.5 text-[10px] font-semibold shrink-0">
                    <TierIcon className="h-3 w-3" />
                    {tConf.label}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  {a.lessons?.title_cs || a.description}
                </p>
              </div>

              {/* Category + difficulty */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {catConf && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-500">
                    {catConf.label}
                  </span>
                )}
                {a.difficulty_overall && (
                  <span className="text-[10px] text-neutral-400">
                    {a.difficulty_overall.toFixed(1)}
                  </span>
                )}
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </motion.div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-dashed border-neutral-200">
          <p className="text-neutral-500">Žádní agenti pro vybraný filtr.</p>
        </div>
      )}

      {/* Demo CTA */}
      {isDemoUser && allFilteredCount > DEMO_AGENT_LIMIT && (
        <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50/50 p-6 text-center">
          <Lock className="h-8 w-8 text-primary-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-900 mb-1">
            Dalších {allFilteredCount - DEMO_AGENT_LIMIT} agentů je dostupných v placeném plánu
          </h3>
          <p className="text-sm text-neutral-500 mb-4">
            Odemkněte všechny AI agenty, lekce a neomezený trénink.
          </p>
          <Link href="/dashboard/balicek">
            <Button className="gap-2">
              Zobrazit plány
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function NovyHovorPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      }>
        <NovyHovorContent />
      </Suspense>
    </ErrorBoundary>
  );
}
