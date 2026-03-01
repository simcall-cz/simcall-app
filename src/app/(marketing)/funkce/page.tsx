import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Trophy,
  Star,
  Medal,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { aiAgents } from "@/data/ai-agents";
import { scenarios } from "@/data/scenarios";

export const metadata: Metadata = {
  title: "Funkce | SimCall",
  description:
    "Objevte všechny funkce SimCall platformy: 10 AI hlasových agentů, realistické scénáře, detailní zpětná vazba a gamifikace pro realitní makléře.",
};

const difficultyConfig = {
  easy: { label: "Snadný", color: "bg-green-100 text-green-700" },
  medium: { label: "Střední", color: "bg-yellow-100 text-yellow-700" },
  hard: { label: "Těžký", color: "bg-red-100 text-red-700" },
} as const;

const avatarColors = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
} as const;

const categoryLabels: Record<string, string> = {
  "hot-lead": "Horký lead",
  "cold-lead": "Studený lead",
  competitive: "Konkurenční",
  negotiation: "Vyjednávání",
  listing: "Zakázka",
};

const categoryBadgeVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  "hot-lead": "success",
  "cold-lead": "secondary",
  competitive: "warning",
  negotiation: "default",
  listing: "secondary",
};

export default function FunkcePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4">Funkce</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-800 tracking-tight">
                Funkce, které vás{" "}
                <GradientText>posunou dál</GradientText>
              </h1>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                Kompletní AI tréninková platforma pro realitní makléře.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* AI Voice Agents Section */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="AI Agenti"
              title="10 unikátních AI hlasových agentů"
              subtitle="Každý agent má vlastní osobnost, komunikační styl a námitky. Trénujte s různými typy klientů a připravte se na cokoli."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgents.map((agent, index) => (
              <ScrollReveal key={agent.id} delay={index * 0.05}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${avatarColors[agent.difficulty]} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                      >
                        {agent.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base">
                          {agent.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {agent.personality}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyConfig[agent.difficulty].color}`}
                      >
                        {difficultyConfig[agent.difficulty].label}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {agent.traits.map((trait) => (
                        <span
                          key={trait}
                          className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Training Scenarios Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Scénáře"
              title="Realistické scénáře z praxe"
              subtitle="Procvičujte si hovory v situacích, které skutečně potkáte. Každý scénář je navržen na základě reálných zkušeností úspěšných makléřů."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario, index) => (
              <ScrollReveal key={scenario.id} delay={index * 0.05}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={categoryBadgeVariant[scenario.category]}>
                        {categoryLabels[scenario.category]}
                      </Badge>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyConfig[scenario.difficulty].color}`}
                      >
                        {difficultyConfig[scenario.difficulty].label}
                      </span>
                    </div>
                    <CardTitle className="mt-3">{scenario.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {scenario.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                        Cíle
                      </p>
                      <ul className="space-y-1.5">
                        {scenario.objectives.map((objective) => (
                          <li
                            key={objective}
                            className="flex items-start gap-2 text-sm text-neutral-600"
                          >
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Feedback & Analysis Section */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Analýza"
              title="Detailní zpětná vazba po každém hovoru"
              subtitle="Po každém tréninkovém hovoru získáte kompletní rozbor. Identifikujte silné stránky, odhalte slabiny a zlepšujte se s každým hovorem."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Card className="mt-12 max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Score Circle */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          stroke="#f5f5f5"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          stroke="#EF4444"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 52 * 0.72} ${2 * Math.PI * 52 * 0.28}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-neutral-800">
                          72%
                        </span>
                        <span className="text-xs text-neutral-500">
                          Celkové skóre
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-neutral-800">
                          4:32
                        </p>
                        <p className="text-xs text-neutral-500">
                          Délka hovoru
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-neutral-800">
                          3/4
                        </p>
                        <p className="text-xs text-neutral-500">
                          Splněné cíle
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transcript Preview */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-semibold text-neutral-800 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary-500" />
                      Přepis hovoru
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-3">
                        <span className="font-medium text-primary-600 shrink-0">
                          Vy:
                        </span>
                        <span className="text-neutral-600">
                          Dobrý den, tady Jan Novák z Reality Plus. Volám ohledně...
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium text-neutral-800 shrink-0">
                          AI:
                        </span>
                        <span className="text-neutral-600">
                          Dobrý den, ale já teď nemám moc čas. O co se jedná?
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium text-primary-600 shrink-0">
                          Vy:
                        </span>
                        <span className="text-neutral-600">
                          Rozumím, budu stručný. Volám vám, protože...
                        </span>
                      </div>
                    </div>

                    {/* Filler words */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-neutral-800 text-sm mb-2">
                        Výplňová slova
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["ehm (3x)", "vlastně (5x)", "jakoby (2x)", "prostě (4x)"].map(
                          (word) => (
                            <span
                              key={word}
                              className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-700 px-2.5 py-0.5 text-xs font-medium"
                            >
                              {word}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-semibold text-green-700 text-sm mb-2">
                          Silné stránky
                        </h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            Profesionální úvod
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            Dobrá práce s námitkami
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            Aktivní naslouchání
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 text-sm mb-2">
                          Ke zlepšení
                        </h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          <li className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            Více konkrétních čísel
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            Snížit tempo řeči
                          </li>
                          <li className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            Silnější closing
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </Container>
      </section>

      {/* Gamification Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Motivace"
              title="Gamifikace a motivace"
              subtitle="Získávejte odznaky, soupeřte s kolegy a sledujte svůj pokrok. Motivační systém, který vás posouvá vpřed každý den."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Achievement Badges */}
            <ScrollReveal delay={0.05}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Odznaky a achievementy</CardTitle>
                  <CardDescription>
                    Sbírejte odznaky za splněné výzvy a milníky
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        icon: Trophy,
                        label: "Prvních 10 hovorů",
                        color: "text-yellow-500 bg-yellow-50",
                      },
                      {
                        icon: Star,
                        label: "Skóre 90%+",
                        color: "text-primary-500 bg-primary-50",
                      },
                      {
                        icon: Medal,
                        label: "7denní série",
                        color: "text-blue-500 bg-blue-50",
                      },
                      {
                        icon: Zap,
                        label: "Speed master",
                        color: "text-orange-500 bg-orange-50",
                      },
                      {
                        icon: TrendingUp,
                        label: "Zlepšení 20%",
                        color: "text-green-500 bg-green-50",
                      },
                      {
                        icon: BarChart3,
                        label: "All scenarios",
                        color: "text-purple-500 bg-purple-50",
                      },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        className="flex flex-col items-center text-center"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl ${badge.color} flex items-center justify-center`}
                        >
                          <badge.icon className="w-6 h-6" />
                        </div>
                        <span className="mt-2 text-xs text-neutral-600 leading-tight">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Leaderboard */}
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Žebříček</CardTitle>
                  <CardDescription>
                    Soupeřte s kolegy a sledujte své postavení
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: "Markéta V.", score: 94, trend: "+3" },
                      { rank: 2, name: "Tomáš K.", score: 91, trend: "+1" },
                      { rank: 3, name: "Jan P.", score: 87, trend: "-1" },
                      { rank: 4, name: "Lucie S.", score: 82, trend: "+5" },
                      { rank: 5, name: "Petr N.", score: 79, trend: "0" },
                    ].map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-3 p-2 rounded-lg ${entry.rank <= 3 ? "bg-neutral-50" : ""}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : entry.rank === 2
                                ? "bg-neutral-200 text-neutral-700"
                                : entry.rank === 3
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-white text-neutral-500"
                            }`}
                        >
                          {entry.rank}
                        </span>
                        <span className="text-sm font-medium text-neutral-800 flex-1">
                          {entry.name}
                        </span>
                        <span className="text-sm font-semibold text-neutral-800">
                          {entry.score}%
                        </span>
                        <span
                          className={`text-xs ${entry.trend.startsWith("+")
                              ? "text-green-600"
                              : entry.trend === "0"
                                ? "text-neutral-400"
                                : "text-red-500"
                            }`}
                        >
                          {entry.trend === "0" ? "-" : entry.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Progress Bars */}
            <ScrollReveal delay={0.15}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Sledování pokroku</CardTitle>
                  <CardDescription>
                    Vizualizace vašeho zlepšování v čase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {[
                      { label: "Celkové skóre", value: 72, color: "bg-primary-500" },
                      { label: "Práce s námitkami", value: 65, color: "bg-yellow-500" },
                      { label: "Closing", value: 48, color: "bg-orange-500" },
                      { label: "Aktivní naslouchání", value: 85, color: "bg-green-500" },
                      { label: "Profesionalita", value: 91, color: "bg-blue-500" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm text-neutral-700">
                            {item.label}
                          </span>
                          <span className="text-sm font-semibold text-neutral-800">
                            {item.value}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-neutral-900">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Připraveni na lepší hovory?
              </h2>
              <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                Vyzkoušejte SimCall zdarma. Bez závazků, bez kreditní karty.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    Vyzkoušet demo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
                  >
                    Zobrazit ceník
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
