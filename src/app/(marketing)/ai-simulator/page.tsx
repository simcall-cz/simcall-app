import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, BarChart3, Mic, Check } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { aiAgents } from "@/data/ai-agents";

export const metadata: Metadata = {
  title: "AI Simulátor | SimCall",
  description:
    "500 AI scénářů pro realitní makléře. Trénujte hovory s realistickými AI agenty — od snadných po extrémně náročné situace.",
};

const difficultyColors = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
} as const;

const difficultyLabels = {
  easy: "Snadný",
  medium: "Střední",
  hard: "Těžký",
} as const;

const difficultyBadge = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
} as const;

const categories = [
  { emoji: "😤", label: "Skeptici", desc: "Nedůvěřiví majitelé, kteří nevěří makléřům" },
  { emoji: "💼", label: "Investoři", desc: "Analytici hledající nejlepší výnos" },
  { emoji: "👨‍👩‍👧", label: "Rodiny", desc: "Emocionální rozhodnutí spojená s bydlením" },
  { emoji: "🏗️", label: "Developeři", desc: "Profesionálové s vysokými nároky" },
  { emoji: "🏠", label: "Nájemníci", desc: "Hledají perfektní místo k bydlení" },
  { emoji: "🌍", label: "Zahraniční", desc: "Jazyková a kulturní bariéra" },
];

const steps = [
  {
    num: "01",
    icon: Phone,
    title: "Vyber agenta",
    desc: "Zvol typ klienta a obtížnost — od přátelského majitele po extrémně skeptického investora.",
  },
  {
    num: "02",
    icon: Mic,
    title: "Zavolej v reálném čase",
    desc: "Hovor probíhá přímo v prohlížeči. AI agent reaguje přirozeně, klade námitky, ptá se.",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Získej okamžitou zpětnou vazbu",
    desc: "Skóre, přepis, detekce výplňových slov a konkrétní tipy ke zlepšení ihned po hovoru.",
  },
];

export default function AiSimulatorPage() {
  const showcaseAgents = aiAgents.slice(0, 12);
  const extraCount = 500 - showcaseAgents.length;

  return (
    <>
      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-primary-50/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-neutral-50 blur-3xl" />
        </div>

        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <Badge className="mb-5">AI Simulátor hovorů</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-800 leading-[1.1]">
                500 AI scénářů.{" "}
                <GradientText>Každý hovor jiný.</GradientText>
              </h1>
              <p className="mt-5 text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                Připravili jsme 500 různých AI klientů — od přátelských majitelů po
                extrémně náročné investory. Každý má vlastní osobnost, námitky a
                komunikační styl.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/registrace">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Vyzkoušet zdarma — 3 hovory
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Zobrazit ceník
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs text-neutral-400">Bez kreditní karty. Bez závazků.</p>
            </ScrollReveal>
          </div>

          {/* Stats strip */}
          <ScrollReveal delay={0.15}>
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: "500+", label: "AI agentů" },
                { value: "3 úrovně", label: "obtížnosti" },
                { value: "6 kategorií", label: "klientů" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ================================ */}
      {/* HOW IT WORKS                     */}
      {/* ================================ */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Jak to funguje"
              title="Od výběru agenta po zpětnou vazbu"
              subtitle="Celý proces trvá méně než 10 minut."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div className="relative text-center p-6 rounded-2xl border border-neutral-100 bg-white hover:shadow-lg transition-shadow">
                  <span className="text-5xl font-black text-neutral-100">{step.num}</span>
                  <div className="mt-2 flex justify-center">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-primary-500" />
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-800">{step.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-neutral-200">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================================ */}
      {/* DIFFICULTY SPECTRUM              */}
      {/* ================================ */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Obtížnost"
              title="Připravte se na každou situaci"
              subtitle="Začněte jednoduše, postupně zvyšujte náročnost."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-10 max-w-3xl mx-auto">
              {/* Spectrum bar */}
              <div className="flex rounded-2xl overflow-hidden h-14 shadow-sm">
                <div className="flex-1 bg-green-500 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">Snadný</span>
                </div>
                <div className="flex-1 bg-yellow-500 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">Střední</span>
                </div>
                <div className="flex-1 bg-red-500 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">Těžký</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="font-semibold text-green-800">Přátelský</p>
                  <p className="text-green-600 text-xs mt-1">Vstřícní klienti, méně námitek</p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                  <p className="font-semibold text-yellow-800">Náročný</p>
                  <p className="text-yellow-600 text-xs mt-1">Cílené otázky, běžné námitky</p>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <p className="font-semibold text-red-800">Extrémně těžký</p>
                  <p className="text-red-600 text-xs mt-1">Skeptici, agresivní vyjednávání</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ================================ */}
      {/* AGENT SHOWCASE                   */}
      {/* ================================ */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="AI Agenti"
              title="Poznejte naše agenty"
              subtitle="Každý má vlastní jméno, osobnost a způsob komunikace."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {showcaseAgents.map((agent, i) => (
              <ScrollReveal key={agent.id} delay={i * 0.04}>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-white border border-neutral-100 hover:shadow-md transition-shadow group text-center">
                  <div
                    className={`w-14 h-14 rounded-full ${difficultyColors[agent.difficulty]} text-white flex items-center justify-center text-base font-bold shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {agent.avatarInitials}
                  </div>
                  <p className="mt-2.5 text-xs font-semibold text-neutral-800 leading-tight">{agent.name}</p>
                  <p className="mt-0.5 text-[10px] text-neutral-400 leading-tight line-clamp-1">{agent.personality}</p>
                  <span className={`mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyBadge[agent.difficulty]}`}>
                    {difficultyLabels[agent.difficulty]}
                  </span>
                </div>
              </ScrollReveal>
            ))}

            {/* Extra count */}
            <ScrollReveal delay={0.5}>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-neutral-100/50 border border-dashed border-neutral-200 text-center h-full justify-center">
                <div className="w-14 h-14 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-sm font-bold">
                  +{extraCount}
                </div>
                <p className="mt-2.5 text-xs font-medium text-neutral-500">dalších agentů</p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ================================ */}
      {/* CATEGORIES                       */}
      {/* ================================ */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Kategorie"
              title="6 typů klientů"
              subtitle="Každá kategorie přináší jiné výzvy a námitky."
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 0.07}>
                <div className="p-5 rounded-2xl bg-white border border-neutral-100 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{cat.emoji}</div>
                  <h3 className="font-semibold text-neutral-800">{cat.label}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{cat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================================ */}
      {/* CTA                              */}
      {/* ================================ */}
      <section className="py-20 sm:py-28 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Vyzkoušejte simulátor zdarma
              </h2>
              <p className="mt-4 text-neutral-400 leading-relaxed">
                3 hovory a 1 AI agent zdarma. Bez kreditní karty.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/registrace">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Začít zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 w-full sm:w-auto"
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
