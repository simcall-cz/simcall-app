"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mic,
  FileText,
  BarChart3,
  TrendingUp,
  User,
  Users,
  Check,
  Phone,
  Sparkles,
  Zap,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CallInterfaceMockup } from "@/components/marketing/call-interface-mockup";
import { AnalyticsMockup } from "@/components/marketing/analytics-mockup";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";

import { aiAgents } from "@/data/ai-agents";

/* ------------------------------------------------------------------ */
/*  Difficulty config                                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Steps data                                                          */
/* ------------------------------------------------------------------ */
const steps = [
  {
    num: "01",
    icon: Phone,
    title: "Vyberte scénář",
    desc: "Zvolte si typ hovoru a AI agenta, se kterým chcete trénovat.",
  },
  {
    num: "02",
    icon: Mic,
    title: "Zavolejte AI agentovi",
    desc: "Hovor probíhá v reálném čase přímo ve vašem prohlížeči.",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Získejte zpětnou vazbu",
    desc: "Okamžitá analýza se skóre, přepisem a doporučeními.",
  },
];

/* ------------------------------------------------------------------ */
/*  Feature bullets                                                     */
/* ------------------------------------------------------------------ */
const featureBullets = [
  { icon: Mic, text: "10 AI agentů s vlastní osobností" },
  { icon: FileText, text: "Realistické scénáře z praxe" },
  { icon: BarChart3, text: "Detailní analýza po každém hovoru" },
  { icon: TrendingUp, text: "Sledování pokroku v čase" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const showcaseAgents = aiAgents.slice(0, 5);

  return (
    <>
      {/* ============================================ */}
      {/* HERO - Split layout                          */}
      {/* ============================================ */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary-50/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-50/30 blur-3xl" />
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <ScrollReveal>
                <Badge className="mb-5">AI trénink pro realitní makléře</Badge>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-800 leading-[1.1]">
                  Trénujte hovory{" "}
                  <GradientText>s&nbsp;AI.</GradientText>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <ul className="mt-6 space-y-2.5">
                  {[
                    "Realistické simulace hovorů s AI agenty",
                    "Okamžitá zpětná vazba a analýza",
                    "Přepis, skóre a doporučení ke zlepšení",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-neutral-500"
                    >
                      <Check className="w-4 h-4 text-primary-500 shrink-0" />
                      <span className="text-base sm:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/demo">
                    <Button size="lg" className="group w-full sm:w-auto">
                      Vyzkoušet demo
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/cenik">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Zobrazit ceník
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Call Interface Mockup */}
            <div className="flex justify-center lg:justify-end">
              <CallInterfaceMockup />
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS - 3 steps                       */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Jak to funguje"
              title="Tři kroky k lepším hovorům"
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <ScrollReveal key={step.num} delay={index * 0.1}>
                <div className="relative text-center p-6 rounded-2xl border border-neutral-100 bg-white hover:shadow-lg transition-shadow">
                  {/* Step number */}
                  <span className="text-5xl font-black text-neutral-100">
                    {step.num}
                  </span>
                  <div className="mt-2 flex justify-center">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-primary-500" />
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-800">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Connecting arrow (hidden on last + mobile) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 sm:-right-5 -translate-y-1/2 text-neutral-200">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* PRODUCT SHOWCASE - Call Interface + Features  */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Mockup */}
            <div className="flex justify-center order-2 lg:order-1">
              <CallInterfaceMockup className="max-w-xs sm:max-w-sm" />
            </div>

            {/* Right: Text */}
            <div className="order-1 lg:order-2">
              <ScrollReveal>
                <Badge className="mb-4">Produkt</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 tracking-tight">
                  Realistické hovory{" "}
                  <GradientText>s AI agenty</GradientText>
                </h2>
                <p className="mt-3 text-neutral-500 leading-relaxed">
                  10 unikátních osobností. Každý reaguje jinak, má vlastní
                  námitky a komunikační styl.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featureBullets.map((f) => (
                    <div
                      key={f.text}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <f.icon className="w-4 h-4 text-primary-500" />
                      </div>
                      <span className="text-sm text-neutral-700 leading-snug mt-1">
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/funkce">
                    <Button variant="outline" className="group w-full sm:w-auto">
                      Prozkoumat funkce
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button className="w-full sm:w-auto">
                      Vyzkoušet demo
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* ANALYTICS SHOWCASE - Feedback mockup          */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-900 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <ScrollReveal>
                <Badge className="mb-4">Zpětná vazba</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Okamžitá analýza{" "}
                  <span className="text-primary-400">každého hovoru</span>
                </h2>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  Přepis, skóre, silné stránky i konkrétní doporučení ke
                  zlepšení. Vše automaticky po každém hovoru.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <ul className="mt-6 space-y-3">
                  {[
                    "Celkové skóre a splněné cíle",
                    "Kompletní přepis hovoru",
                    "Identifikace výplňových slov",
                    "Konkrétní tipy ke zlepšení",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-neutral-300"
                    >
                      <Sparkles className="w-4 h-4 text-primary-400 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="mt-8">
                  <Link href="/funkce">
                    <Button
                      variant="outline"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 group"
                    >
                      Zjistit více
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Analytics Mockup */}
            <div className="flex justify-center">
              <AnalyticsMockup className="max-w-sm w-full" />
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* AUDIENCE SPLIT - Pro makléře / Pro manažery   */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Pro koho je ELITE AI"
              title="Řešení pro makléře i manažery"
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pro makléře */}
            <ScrollReveal delay={0.05}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400" />
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">
                  Pro makléře
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Trénujte bez stresu, kdykoliv",
                    "Získejte okamžitou zpětnou vazbu",
                    "Zlepšujte se s každým hovorem",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-neutral-600"
                    >
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pro-maklere"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors group"
                >
                  Více pro makléře
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Pro manažery */}
            <ScrollReveal delay={0.1}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">
                  Pro manažery
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Přehled o výkonnosti celého týmu",
                    "Data pro efektivní koučink",
                    "Měřitelná návratnost investice",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-neutral-600"
                    >
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pro-manazery"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors group"
                >
                  Více pro manažery
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* AI AGENTS - Compact avatar strip              */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="AI Agenti"
              title="10 unikátních osobností"
              subtitle="Od skeptických klientů po investory. Připravte se na cokoli."
            />
          </ScrollReveal>

          <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 max-w-3xl mx-auto">
            {showcaseAgents.map((agent, index) => (
              <ScrollReveal key={agent.id} delay={index * 0.05}>
                <div className="flex flex-col items-center group">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${difficultyColors[agent.difficulty]} text-white flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {agent.avatarInitials}
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-neutral-800 text-center">
                    {agent.name}
                  </p>
                  <span
                    className={`mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      agent.difficulty === "easy"
                        ? "bg-green-100 text-green-700"
                        : agent.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {difficultyLabels[agent.difficulty]}
                  </span>
                </div>
              </ScrollReveal>
            ))}

            {/* +5 more indicator */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-lg font-bold">
                  +5
                </div>
                <p className="mt-2.5 text-sm font-medium text-neutral-500 text-center">
                  dalších
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.35}>
            <div className="mt-10 text-center">
              <Link href="/funkce">
                <Button variant="outline" className="group">
                  Zobrazit všechny agenty
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================ */}
      {/* PRICING TEASER                                */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Ceník"
              title="Jednoduchý ceník, žádné skryté poplatky"
            />
          </ScrollReveal>

          <div className="mt-12">
            <PricingTeaser />
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/cenik"
                className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
              >
                Porovnat všechny plány
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA                                     */}
      {/* ============================================ */}
      <section className="py-20 sm:py-28 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Připraveni na lepší hovory?
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
                Vyzkoušejte demo zdarma. Bez závazků, bez kreditní karty.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Vyzkoušet demo zdarma
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
