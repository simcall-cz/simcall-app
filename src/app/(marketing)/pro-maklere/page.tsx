import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  X,
  Phone,
  Brain,
  MessageSquare,
  Target,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  User,
  Award,
  Headphones,
  BookOpen,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { IconBox } from "@/components/shared/icon-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pro makléře | ELITE AI",
  description:
    "Staňte se jedničkou ve svém týmu. ELITE AI pomáhá realitním makléřům zlepšit cold calling, zvýšit konverze a získat sebevědomí při telefonování.",
};

const painPoints = [
  {
    title: "Nervozita při studeném volání",
    description:
      "Strach zvednout telefon a zavolat neznámému člověku. Pocit nejistoty, co říct, když vám klient položí nečekanou otázku.",
  },
  {
    title: "Ztráta klientů kvůli nedostatečné přípravě",
    description:
      "Propásnete příležitosti, protože nevíte, jak reagovat na námitky. Konkurence je rychlejší a přesvědčivější.",
  },
  {
    title: "Žádná zpětná vazba na hovory",
    description:
      "Nevíte, co děláte špatně a co dobře. Nikdo vám neřekne, kde se můžete zlepšit a jak na tom pracovat.",
  },
  {
    title: "Repetitivní chyby bez uvědomění",
    description:
      "Opakujete stále stejné chyby, aniž byste si je uvědomovali. Používáte výplňová slova, váháte v klíčových momentech.",
  },
];

const solutions = [
  {
    icon: Headphones,
    title: "Trénujte bez stresu s AI",
    description:
      "Procvičujte si hovory s 10 různými AI agenty, kteří simulují reálné klienty. Žádný strach z odmítnutí, žádné ztracené příležitosti. Trénujte, opakujte a zlepšujte se.",
  },
  {
    icon: BookOpen,
    title: "Připravte se na jakýkoli scénář",
    description:
      "10 realistických scénářů pokrývá všechny situace: od horkých leadů přes cold cally až po vyjednávání o provizi. Buďte připraveni na cokoli.",
  },
  {
    icon: BarChart3,
    title: "Získejte okamžitou zpětnou vazbu",
    description:
      "Po každém hovoru získáte detailní rozbor: skóre, přepis, silné stránky, oblasti ke zlepšení a konkrétní doporučení. Víte přesně, na čem pracovat.",
  },
  {
    icon: Target,
    title: "Odhalte své slabiny automaticky",
    description:
      "AI identifikuje výplňová slova, momenty váhání, chybějící closing techniky a další vzorce, které si sami neuvědomíte. Data mluví jasně.",
  },
];

export default function ProMaklerePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4">Pro makléře</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-800 tracking-tight">
                Staňte se{" "}
                <GradientText>jedničkou</GradientText>{" "}
                ve svém týmu
              </h1>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                Zlepšete své dovednosti v cold callingu, zvyšte konverze a
                získejte sebevědomí při každém telefonátu. ELITE AI je váš
                osobní trenér, který je k dispozici 24/7.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    Vyzkoušet zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/funkce">
                  <Button variant="outline" size="lg">
                    Prozkoumat funkce
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Výzvy"
              title="Znáte to?"
              subtitle="Tyto problémy trápí většinu realitních makléřů. ELITE AI je řeší všechny."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {painPoints.map((point, index) => (
              <ScrollReveal key={point.title} delay={index * 0.05}>
                <Card className="h-full border-red-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <X className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {point.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {point.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Solutions Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Řešení"
              title="ELITE AI má odpověď na každý problém"
              subtitle="Pro každou výzvu existuje konkrétní řešení. Podívejte se, jak vám ELITE AI pomůže."
            />
          </ScrollReveal>

          <div className="mt-16 space-y-16">
            {solutions.map((solution, index) => (
              <ScrollReveal
                key={solution.title}
                delay={0.05}
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <div
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <IconBox className="mb-4">
                      <solution.icon className="w-6 h-6" />
                    </IconBox>
                    <h3 className="text-xl font-bold text-neutral-800">
                      {solution.title}
                    </h3>
                    <p className="mt-3 text-neutral-500 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100 h-48 flex items-center justify-center">
                      <solution.icon className="w-16 h-16 text-neutral-200" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Use Cases / Personas Section */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Pro koho"
              title="Ať jste nováček nebo profík"
              subtitle="ELITE AI se přizpůsobí vaší úrovni a pomůže vám růst bez ohledu na zkušenosti."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Novice Card */}
            <ScrollReveal delay={0.05}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle>Nováček</CardTitle>
                      <CardDescription>
                        Začínající makléř, který si buduje sebevědomí
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                        Typický tréninkový plán
                      </h4>
                      <ol className="space-y-3">
                        {[
                          "Začněte s jednoduchými scénáři (horké leady)",
                          "Procvičte si úvod a představení",
                          "Přejděte na cold cally a práci s námitkami",
                          "Trénujte closing techniky",
                          "Postupně zvyšujte obtížnost agentů",
                        ].map((step, i) => (
                          <li key={step} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm text-neutral-600">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                        Očekávané výsledky
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Zvýšení sebevědomí při telefonování",
                          "Snížení nervozity o 60 % za 2 týdny",
                          "Zvládnutí základních námitky",
                          "Schopnost domluvit schůzku z cold callu",
                        ].map((outcome) => (
                          <li
                            key={outcome}
                            className="flex items-start gap-2 text-sm text-neutral-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Experienced Card */}
            <ScrollReveal delay={0.1}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle>Zkušený makléř</CardTitle>
                      <CardDescription>
                        Profík, který chce vytěžit maximum z každého hovoru
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                        Typický tréninkový plán
                      </h4>
                      <ol className="space-y-3">
                        {[
                          "Zaměřte se na těžké agenty (investoři, vyjednávači)",
                          "Procvičte vyjednávání o provizi",
                          "Zdokonalte práci s emočně náročnými klienty",
                          "Optimalizujte closing a follow-up",
                          "Analyzujte data a eliminujte slabiny",
                        ].map((step, i) => (
                          <li key={step} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm text-neutral-600">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
                        Očekávané výsledky
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Zvýšení konverzního poměru o 25 %",
                          "Lepší obhajoba provize",
                          "Vyšší průměrná hodnota zakázky",
                          "Konzistentně vysoké skóre hovorů",
                        ].map((outcome) => (
                          <li
                            key={outcome}
                            className="flex items-start gap-2 text-sm text-neutral-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Dashboard"
              title="Vše přehledně na jednom místě"
              subtitle="Váš osobní přehled s veškerými statistikami, historií hovorů a doporučeními ke zlepšení."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Card className="mt-12 max-w-5xl mx-auto overflow-hidden border-neutral-200">
              <CardContent className="p-6 sm:p-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    {
                      label: "Celkem hovorů",
                      value: "247",
                      change: "+12 tento týden",
                      color: "text-primary-600",
                    },
                    {
                      label: "Úspěšnost",
                      value: "72 %",
                      change: "+5 % oproti minulému měsíci",
                      color: "text-green-600",
                    },
                    {
                      label: "Tento týden",
                      value: "14",
                      change: "hovorů absolvováno",
                      color: "text-blue-600",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-neutral-50 rounded-xl p-5 border border-neutral-100"
                    >
                      <p className="text-sm text-neutral-500">{stat.label}</p>
                      <p
                        className={`text-2xl font-bold mt-1 ${stat.color}`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {stat.change}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                    Vývoj skóre za posledních 30 dní
                  </h4>
                  <div className="h-40 rounded-xl bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border border-neutral-100 flex items-end justify-around px-4 pb-4">
                    {[40, 55, 45, 60, 58, 65, 62, 70, 68, 72, 75, 72].map(
                      (value, i) => (
                        <div
                          key={i}
                          className="bg-primary-500/80 rounded-t w-full max-w-[24px] mx-0.5"
                          style={{ height: `${value}%` }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Recent Calls */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                    Poslední hovory
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        agent: "Jana Nováková",
                        scenario: "Získání exkluzivní zakázky",
                        score: 78,
                        time: "Dnes, 14:32",
                      },
                      {
                        agent: "Petr Svoboda",
                        scenario: "První kontakt s horkým leadem",
                        score: 92,
                        time: "Dnes, 10:15",
                      },
                      {
                        agent: "Karel Veselý",
                        scenario: "Vyjednávání o provizi",
                        score: 65,
                        time: "Včera, 16:48",
                      },
                    ].map((call) => (
                      <div
                        key={call.time}
                        className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 border border-neutral-100"
                      >
                        <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-800 truncate">
                            {call.agent} - {call.scenario}
                          </p>
                          <p className="text-xs text-neutral-400">{call.time}</p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            call.score >= 80
                              ? "text-green-600"
                              : call.score >= 60
                                ? "text-yellow-600"
                                : "text-red-500"
                          }`}
                        >
                          {call.score} %
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-neutral-900">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Začněte trénovat ještě dnes
              </h2>
              <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                14 dní zdarma, bez platební karty. Zjistěte, jak moc se můžete
                zlepšit za pouhé dva týdny.
              </p>
              <div className="mt-8">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    Vyzkoušet zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
