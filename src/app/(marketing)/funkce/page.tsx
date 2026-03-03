import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileText,
  TrendingUp,
  BarChart3,
  Trophy,
  Wand2,
  Check,
  Building2,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalyticsMockup } from "@/components/marketing/analytics-mockup";

export const metadata: Metadata = {
  title: "Funkce | SimCall",
  description:
    "Všechny funkce SimCall: AI analýza hovorů, přepisy, manager dashboard, žebříčky a vlastní AI agenti na míru.",
};

const features = [
  {
    icon: Sparkles,
    title: "AI analýza každého hovoru",
    desc: "Automatické skóre, silné stránky a konkrétní tipy ke zlepšení ihned po hovoru.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: FileText,
    title: "Přepis a nahrávka",
    desc: "Kompletní přepis s detekcí výplňových slov. Export do PDF nebo CSV.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: TrendingUp,
    title: "Sledování pokroku",
    desc: "Podrobné statistiky a grafy vašeho zlepšení v čase. Vidíte přesně, kde rostete.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: BarChart3,
    title: "Manager dashboard",
    desc: "Přehled výkonu celého týmu na jednom místě. Analytika každého makléře zvlášť.",
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
    desc: "Vlastní scénáře ze situací vaší firmy. White-label pod vaší značkou.",
    tag: "Enterprise",
    tagColor: "bg-purple-50 text-purple-600",
  },
];

const plans = [
  {
    id: "solo",
    icon: Check,
    name: "Solo",
    color: "text-primary-500",
    border: "border-primary-200",
    bg: "bg-primary-50/50",
    highlighted: false,
    items: [
      "AI analýza hovoru",
      "Přepis hovoru",
      "Historie hovorů a nahrávky",
      "Sledování pokroku a statistiky",
      "Personalizovaná doporučení",
      "Pokročilá analýza (detailní scoring)",
      "Export přepisů (PDF/CSV)",
    ],
    price: "od 490 Kč/měs",
    href: "/checkout?plan=solo&tier=0",
  },
  {
    id: "team",
    icon: Users,
    name: "Team",
    color: "text-blue-500",
    border: "border-blue-200",
    bg: "bg-blue-50/50",
    highlighted: true,
    items: [
      "Vše ze Solo",
      "Manager dashboard",
      "Neomezený počet uživatelů",
      "Správa týmu",
      "Analytika zaměstnanců",
      "Žebříčky v týmu",
      "Sdílená banka hovorů",
    ],
    price: "od 2 490 Kč/měs",
    href: "/checkout?plan=team&tier=0",
  },
  {
    id: "enterprise",
    icon: Building2,
    name: "Enterprise",
    color: "text-purple-500",
    border: "border-purple-200",
    bg: "bg-purple-50/50",
    highlighted: false,
    items: [
      "Vše z Team",
      "White-label řešení",
      "Vlastní AI agenti a scénáře",
      "Dedikovaný account manažer",
      "Počet hovorů a agentů dohodou",
      "Vlastní analytiky na míru",
    ],
    price: "Cena dohodou",
    href: "/domluvit-schuzku",
  },
];

export default function FunkcePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-primary-50/50 blur-3xl" />
        </div>
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <ScrollReveal>
              <Badge className="mb-5">Funkce</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-800 leading-[1.1]">
                Vše co potřebujete.{" "}
                <GradientText>Nic navíc.</GradientText>
              </h1>
              <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
                Od individuálního tréninku po správu celého týmu. SimCall roste s vámi.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mt-7 flex gap-3 justify-center">
                <Link href="/registrace">
                  <Button size="lg" className="group">
                    Začít zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button variant="outline" size="lg">Zobrazit ceník</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* FEATURE GRID */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader badge="Co dostanete" title="Klíčové funkce" />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.07}>
                <div className="h-full bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <f.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${f.tagColor}`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-sm leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ANALYTICS SHOWCASE */}
      <section className="py-16 sm:py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <ScrollReveal>
                <Badge className="mb-4">Zpětná vazba</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Okamžitá analýza{" "}
                  <span className="text-primary-400">každého hovoru</span>
                </h2>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  Po každém hovoru dostanete podrobný report — skóre, přepis,
                  výplňová slova a tipy co zlepšit.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ul className="mt-6 space-y-3">
                  {[
                    "Celkové skóre a splněné cíle",
                    "Kompletní přepis s časovými razítky",
                    "Identifikace výplňových slov",
                    "Personalizované tipy ke zlepšení",
                    "Export do PDF nebo CSV",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-neutral-300">
                      <Sparkles className="w-4 h-4 text-primary-400 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
            <div className="flex justify-center">
              <AnalyticsMockup className="max-w-sm w-full" />
            </div>
          </div>
        </Container>
      </section>

      {/* PLAN COMPARISON */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Plány"
              title="Vyberte plán pro vás"
              subtitle="Solo pro jednotlivce, Team pro firmy, Enterprise na míru."
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.id} delay={i * 0.08}>
                <div className={`h-full rounded-2xl border ${plan.border} ${plan.bg} p-6 flex flex-col ${plan.highlighted ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <plan.icon className={`w-5 h-5 ${plan.color}`} />
                    <h3 className="font-bold text-neutral-800">{plan.name}</h3>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.color}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-neutral-200/50">
                    <p className={`text-sm font-bold ${plan.color}`}>{plan.price}</p>
                    <Link href={plan.href} className="mt-3 block">
                      <Button variant="outline" size="sm" className="w-full group">
                        Začít
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-8 text-center">
              <Link href="/cenik" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                Podrobné porovnání plánů
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-white">Připraveni začít?</h2>
              <p className="mt-3 text-neutral-400">3 hovory zdarma. Bez kreditní karty.</p>
              <div className="mt-7 flex gap-3 justify-center flex-wrap">
                <Link href="/registrace">
                  <Button size="lg" className="group">
                    Vyzkoušet zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600">
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
