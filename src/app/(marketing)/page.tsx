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
  Sparkles,
  Trophy,
  Wand2,
  Building2,
  Shield,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { HeroMockup } from "@/components/marketing/hero-mockup";
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
    icon: Mic,
    title: "Vyberte scénář",
    desc: "Zvolte AI agenta a typ hovoru — od studeného kontaktu po náročné námitky.",
  },
  {
    num: "02",
    icon: BarChart3,
    title: "Zavolejte AI agentovi",
    desc: "Hovor probíhá v reálném čase přímo ve vašem prohlížeči. Bez instalace.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Získejte zpětnou vazbu",
    desc: "Okamžitá AI analýza se skóre, přepisem, výplňovými slovy a doporučeními.",
  },
];

/* ------------------------------------------------------------------ */
/*  Features                                                            */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Sparkles,
    title: "AI analýza každého hovoru",
    desc: "Automatické vyhodnocení se skóre, silnými stránkami a konkrétními tipy ke zlepšení.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: FileText,
    title: "Přepis a nahrávka",
    desc: "Kompletní přepis hovoru a detekce výplňových slov, které zabíjejí vaše obchody.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: TrendingUp,
    title: "Sledování pokroku",
    desc: "Detailní statistiky vašeho zlepšení v čase. Vidíte přesně, kde rostete.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: BarChart3,
    title: "Manager dashboard",
    desc: "Přehled výkonu celého týmu na jednom místě. Analytika každého makléře.",
    tag: "Team",
    tagColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: Trophy,
    title: "Žebříčky v týmu",
    desc: "Gamifikace motivující makléře k pravidelnému tréninku. Sdílená banka hovorů.",
    tag: "Team",
    tagColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wand2,
    title: "AI agenti na míru",
    desc: "Scénáře z reálných situací vaší firmy. White-label řešení pod vaší značkou.",
    tag: "Enterprise",
    tagColor: "bg-purple-50 text-purple-600",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const showcaseAgents = aiAgents.slice(0, 5);
  const extraAgentsCount = aiAgents.length - 5;

  return (
    <>
      {/* ============================================ */}
      {/* HERO                                         */}
      {/* ============================================ */}
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28">
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
                  Přestaňte pálit <br />
                  <GradientText>drahé leady</GradientText>
                  <br />
                  kvůli chybám u telefonu
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <ul className="mt-6 space-y-2.5">
                  {[
                    "Konec 50stránkových PDF a zastaralých videokurzů",
                    "Aplikace naprogramovaná z praxe: Nejlépe se učí na sluchátku",
                    "Zbavte nováčky strachu nanečisto, než jim dáte reálné klienty",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-neutral-500"
                    >
                      <Check className="w-5 h-5 text-primary-500 shrink-0" />
                      <span className="text-base sm:text-lg font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
                      className="w-full sm:w-auto"
                    >
                      Zobrazit ceník
                    </Button>
                  </Link>
                </div>
                <p className="mt-3 text-xs text-neutral-400">
                  Zdarma: 3 hovory a 1 AI agent. Bez kreditní karty.
                </p>
              </ScrollReveal>
            </div>

            {/* Right: Hero Mockup */}
            <div className="flex justify-center lg:justify-end">
              <HeroMockup />
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
              title="Od paralyzovaného nováčka k profesionálovi ve 3 krocích"
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <ScrollReveal key={step.num} delay={index * 0.1}>
                <div className="relative text-center p-6 rounded-2xl border border-neutral-100 bg-white hover:shadow-lg transition-shadow">
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
      {/* NOT JUST FOR BEGINNERS                       */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <ScrollReveal>
                <Badge className="mb-4">I pro pokročilé</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Není to jen pro nováčky.{" "}
                  <span className="text-primary-400">Zdokonalte se i vy.</span>
                </h2>
                <p className="mt-5 text-neutral-400 leading-relaxed">
                  Naši pokročilí AI agenti mají hlubokou znalost českého práva, smluvních procesů a neobvyklých situací. Můžete si ověřit, že znáte správné řešení, nebo se připravit na případy, které jste ještě nikdy neřešili.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <ul className="mt-8 space-y-3">
                  {[
                    "Developerské projekty a prodej celých bytových domů",
                    "Vyplacení exekuce klienta a komplikované zástavy",
                    "Stavba bez stavebního povolení — jak to řešit s kupcem",
                    "Nájemník odmítá odejít — prodej obsazené nemovitosti",
                    "Dědické spory a prodej s více vlastníky",
                    "Právní nuance: věcná břemena, předkupní práva, zápisy v katastru",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-neutral-300">
                      <Shield className="w-4 h-4 text-primary-400 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-8 sm:p-10">
                <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed italic">
                  „I když prodávám 10 let, našel jsem v SimCallu případy, které jsem nikdy neřešil. Třeba prodej nemovitosti s nájemníkem, který odmítá odejít. Teď vím přesně, co říc klientovi.“
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-400">PM</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Pokročilý makléř</p>
                    <p className="text-xs text-neutral-500">10+ let v oboru</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* FEATURES GRID                                */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Funkce"
              title="Vše, co potřebujete k masivnímu růstu prodejů"
              subtitle="Neztrácejte čas neefektivním trénováním. Nechte umělou inteligenci odhalit chyby, které vás a váš tým stojí tisíce na provizích."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.07}>
                <div className="h-full bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <feature.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${feature.tagColor}`}>
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-sm leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-10 text-center">
              <Link href="/registrace">
                <Button size="lg" className="group">
                  Vyzkoušet zdarma
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================ */}
      {/* ANALYTICS SHOWCASE                           */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <ScrollReveal>
                <Badge className="mb-4">Zpětná vazba</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Odhalte chyby, které vás stojí{" "}
                  <span className="text-primary-400">statisíce na provizích</span>
                </h2>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  Každé zaváhání u telefonu vás může stát klienta. Naše AI zanalyzuje každý detail hovoru a ukáže vám, jak dotáhnout obchod do úspěšného konce. Vycvičte si nekompromisní tah na branku.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <ul className="mt-6 space-y-3">
                  {[
                    "Celkové skóre a splněné cíle hovoru",
                    "Kompletní přepis s časovými razítky",
                    "Identifikace výplňových slov",
                    "Personalizované tipy ke zlepšení",
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
                <div className="mt-8 flex gap-3">
                  <Link href="/registrace">
                    <Button size="sm" className="group">
                      Vyzkoušet zdarma
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/cenik">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
                    >
                      Zobrazit ceník
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
      {/* AUDIENCE SPLIT - Makléři / Manažeři          */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Pro koho je SimCall"
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
                  Pro makléře & nováčky
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Zbavte se paralyzujícího strachu z volání a získejte sebevědomí",
                    "Natrénujte si ty nejtěžší námitky nanečisto – neztrácíte leady",
                    "Získejte okamžitou zpětnou vazbu a konkrétní tipy co říct jinak",
                    "Maximalizujte svou úspěšnost a vydělávejte mnohonásobně vyšší provize",
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
                  href="/cenik"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors group"
                >
                  Solo plán od 490 Kč/měs.
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
                  Pro majitele kanceláří & manažery
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Neztrácejte navždy svůj drahocenný čas tréninkem juniorů",
                    "Předávejte platící leady makléřům až když jsou 100% připraveni",
                    "Získejte absolutní kontrolu nad prodejními dovednostmi a aktivitou týmu",
                    "Vybudujte z kanceláře tvrdé prodejce díky žebříčkům a gamifikaci",
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
                  href="/cenik"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors group"
                >
                  Team plán od 2 490 Kč/měs.
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Enterprise teaser */}
          <ScrollReveal delay={0.15}>
            <div className="mt-6 max-w-4xl mx-auto rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-400" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-800">
                    Pro velké developerské a realitní korporace
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Nasazení pod vaší značkou. Do AI agentů nahrajeme vaše skutečné firemní procesy, nejčastější chyby na pobočkách a zaručené prodejní skripty. Dostaňte obrat celé sítě na novou úroveň.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["White-label", "Vlastní AI agenti na míru", "Dedikovaný vývojář"].map((item) => (
                      <span key={item} className="text-[11px] font-medium bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/domluvit-schuzku" className="shrink-0">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 group whitespace-nowrap">
                    Domluvit schůzku
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================ */}
      {/* AI AGENTS                                    */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="AI Agenti"
              title="500+ scénářů z reálného prostředí"
              subtitle="Arogantní investoři, skeptičtí slevovači i zmatení dědicové. Trénujte na realitě."
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
                    className={`mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${agent.difficulty === "easy"
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

            {extraAgentsCount > 0 && (
              <ScrollReveal delay={0.3}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-lg font-bold">
                    +{extraAgentsCount}
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-neutral-500 text-center">
                    dalších
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>

          <ScrollReveal delay={0.35}>
            <div className="mt-10 text-center">
              <Link href="/registrace">
                <Button size="lg" className="group">
                  Vyzkoušet zdarma — 3 hovory
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================ */}
      {/* PRICING TEASER                               */}
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
      {/* FINAL CTA                                    */}
      {/* ============================================ */}
      <section className="py-20 sm:py-28 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Nemusíte ztrácet další klienty.
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
                Pošlete své makléře do Simulátoru a zvyšte celkové tržby vaší kanceláře. Začněte ještě dnes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
