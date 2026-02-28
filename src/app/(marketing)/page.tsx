"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Phone,
  Target,
  BarChart3,
  Star,
  Mic,
  FileText,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { IconBox } from "@/components/shared/icon-box";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { features } from "@/data/features";
import { aiAgents } from "@/data/ai-agents";
import { testimonials } from "@/data/testimonials";

/* ------------------------------------------------------------------ */
/*  Icon map for dynamic rendering from feature data                  */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mic,
  FileText,
  BarChart3,
  TrendingUp,
  Trophy,
  Users,
};

/* ------------------------------------------------------------------ */
/*  Difficulty helpers                                                */
/* ------------------------------------------------------------------ */
const difficultyLabel: Record<string, string> = {
  easy: "Snadn\u00fd",
  medium: "St\u0159edn\u00ed",
  hard: "T\u011b\u017ek\u00fd",
};

const difficultyVariant: Record<
  string,
  "success" | "warning" | "default"
> = {
  easy: "success",
  medium: "warning",
  hard: "default",
};

/* ------------------------------------------------------------------ */
/*  How-it-works steps                                                */
/* ------------------------------------------------------------------ */
const steps = [
  {
    number: "01",
    icon: Target,
    title: "Vyberte sc\u00e9n\u00e1\u0159",
    description:
      "Zvolte si z nab\u00eddky realistick\u00fdch situac\u00ed \u2014 osloven\u00ed studen\u00e9ho kontaktu, reakce na hork\u00fd lead, vyjedn\u00e1v\u00e1n\u00ed provize a dal\u0161\u00ed.",
  },
  {
    number: "02",
    icon: Phone,
    title: "Zavolejte AI agentovi",
    description:
      "Zahajte hovor s AI agentem, kter\u00fd reaguje v re\u00e1ln\u00e9m \u010dase. Ka\u017ed\u00fd agent m\u00e1 vlastn\u00ed osobnost, emoce a n\u00e1mitky.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Z\u00edskejte zp\u011btnou vazbu",
    description:
      "Po hovoru obdr\u017e\u00edte detailn\u00ed anal\u00fdzu: p\u0159epis hovoru, hodnocen\u00ed \u00fasp\u011b\u0161nosti, siln\u00e9 str\u00e1nky a doporu\u010den\u00ed ke zlep\u0161en\u00ed.",
  },
];

/* ------------------------------------------------------------------ */
/*  Stats                                                             */
/* ------------------------------------------------------------------ */
const stats = [
  { target: 500, suffix: "+", label: "makl\u00e9\u0159\u016f" },
  { target: 10000, suffix: "+", label: "hovor\u016f" },
  { target: 85, suffix: "%", label: "\u00fasp\u011b\u0161nost" },
  { target: 10, suffix: "", label: "AI agent\u016f" },
];

/* ------------------------------------------------------------------ */
/*  Logo cloud companies                                              */
/* ------------------------------------------------------------------ */
const companies = [
  "RE/MAX",
  "Century 21",
  "M&M Reality",
  "Bezrealitky",
  "Next Reality",
];

/* ================================================================== */
/*  HomePage                                                          */
/* ================================================================== */
export default function HomePage() {
  return (
    <>
      {/* ============================================================ */}
      {/*  HERO SECTION                                                */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-50/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-50/40 blur-3xl" />
        </div>

        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <ScrollReveal>
              <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-primary-100 mb-6">
                {`Nov\u00fd zp\u016fsob tr\u00e9ninku pro makl\u00e9\u0159e`}
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-800 leading-[1.1]">
                {`Tr\u00e9nujte obchodn\u00ed`}{" "}
                <br className="hidden sm:block" />
                {"hovory "}
                <GradientText>{`s\u00a0AI.`}</GradientText>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-6 text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                {`Realitn\u00ed makl\u00e9\u0159i zvy\u0161uj\u00ed svou \u00fasp\u011b\u0161nost a\u017e o\u00a040\u00a0% d\u00edky tr\u00e9ninku s\u00a0AI agenty. Realistick\u00e9 simulace hovor\u016f, okam\u017eit\u00e1 zp\u011btn\u00e1 vazba a\u00a0personalizovan\u00e9 lekce\u00a0\u2014 v\u0161e na jednom m\u00edst\u011b.`}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/demo"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group gap-2"
                  )}
                >
                  {`Vyzkou\u0161et demo`}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/funkce"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  {`Zjistit v\u00edce`}
                </Link>
              </div>
            </ScrollReveal>

            {/* Hero mockup - decorative phone-call UI */}
            <ScrollReveal delay={0.45}>
              <div className="mt-16 mx-auto max-w-sm">
                <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-800 p-6 shadow-2xl ring-1 ring-white/10">
                  {/* Status bar */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-6">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="block w-4 h-2.5 rounded-sm border border-neutral-500" />
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary-400">
                        JN
                      </span>
                    </div>
                    <p className="text-white font-semibold text-lg">
                      {`Jana Nov\u00e1kov\u00e1`}
                    </p>
                    <p className="text-neutral-400 text-sm mt-1">
                      {`Skeptick\u00fd klient`}
                    </p>

                    {/* Timer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                      className="mt-6 text-3xl font-mono text-primary-400 tabular-nums"
                    >
                      02:34
                    </motion.div>

                    {/* Waveform bars */}
                    <div className="mt-6 flex items-end gap-1 h-8">
                      {[3, 5, 8, 4, 7, 6, 3, 5, 7, 4, 6, 8, 5, 3, 6].map(
                        (h, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-primary-500/60"
                            animate={{
                              height: [
                                `${h * 3}px`,
                                `${h * 5}px`,
                                `${h * 3}px`,
                              ],
                            }}
                            transition={{
                              duration: 0.8 + Math.random() * 0.4,
                              repeat: Infinity,
                              delay: i * 0.05,
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Call controls */}
                  <div className="flex items-center justify-center gap-8 mt-8">
                    <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Phone className="w-6 h-6 text-white rotate-[135deg]" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  LOGO CLOUD / SOCIAL PROOF                                   */}
      {/* ============================================================ */}
      <section className="py-12 border-y border-neutral-100 bg-neutral-25">
        <Container>
          <ScrollReveal>
            <p className="text-center text-sm text-neutral-400 mb-8">
              {`D\u016fv\u011b\u0159uje n\u00e1m p\u0159es 500+ makl\u00e9\u0159\u016f z\u00a0cel\u00e9 \u010cesk\u00e9 republiky`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {companies.map((name) => (
                <span
                  key={name}
                  className="text-lg font-semibold text-neutral-300 select-none"
                >
                  {name}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Jak to funguje"
              title={`T\u0159i jednoduch\u00e9 kroky k lep\u0161\u00edm hovor\u016fm`}
            />
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (visible md+) */}
            <div className="hidden md:block absolute top-14 left-[16.67%] right-[16.67%] h-px bg-neutral-200" />

            {steps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.15}>
                <div className="relative text-center">
                  {/* Step number box */}
                  <div className="relative mx-auto w-28 h-28 rounded-2xl bg-white border border-neutral-100 shadow-card flex flex-col items-center justify-center mb-6">
                    <span className="text-xs font-bold text-primary-500 mb-1">
                      {step.number}
                    </span>
                    <step.icon className="w-7 h-7 text-neutral-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES GRID                                               */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32 bg-neutral-25">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Funkce"
              title={`V\u0161e co pot\u0159ebujete k lep\u0161\u00edm hovor\u016fm`}
            />
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <ScrollReveal key={feature.title} delay={index * 0.1}>
                  <Card className="h-full p-6 transition-shadow duration-300 hover:shadow-card-hover">
                    <CardHeader className="p-0 pb-4">
                      <IconBox>
                        {Icon ? (
                          <Icon className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </IconBox>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardTitle className="mb-2">{feature.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  AI AGENT SHOWCASE                                           */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="AI Agenti"
              title={`Poznejte na\u0161e AI agenty`}
              subtitle={`Ka\u017ed\u00fd agent m\u00e1 svou osobnost, emoce a komunika\u010dn\u00ed styl`}
            />
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiAgents.slice(0, 4).map((agent, index) => (
              <ScrollReveal key={agent.id} delay={index * 0.1}>
                <Card className="h-full p-6 transition-shadow duration-300 hover:shadow-card-hover">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-600">
                        {agent.avatarInitials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-800 truncate">
                        {agent.name}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {agent.personality}
                      </Badge>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <Badge
                    variant={difficultyVariant[agent.difficulty]}
                    className="mb-3"
                  >
                    {difficultyLabel[agent.difficulty]}
                  </Badge>

                  {/* Description (truncated) */}
                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                    {agent.description}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1.5">
                    {agent.traits.slice(0, 3).map((trait) => (
                      <Badge
                        key={trait}
                        variant="outline"
                        className="text-[11px]"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <Link
                href="/funkce"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "group gap-2"
                )}
              >
                {`Zobrazit v\u0161echny agenty`}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  STATISTICS COUNTER                                          */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-24 bg-neutral-900">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-2 text-neutral-400 text-sm font-medium">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Reference"
              title={`Co \u0159\u00edkaj\u00ed na\u0161i klienti`}
            />
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <ScrollReveal key={testimonial.id} delay={index * 0.12}>
                <Card className="h-full p-6 flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-200"
                        )}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-neutral-600 leading-relaxed flex-1 text-sm">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-neutral-600">
                        {testimonial.avatarInitials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                 */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32 bg-neutral-50">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 tracking-tight">
                {`P\u0159ipraveni zlep\u0161it sv\u00e9 hovory?`}
              </h2>
              <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
                {`Vy\u017e\u00e1dejte si demo je\u0161t\u011b dnes a\u00a0zjist\u011bte, jak v\u00e1m ELITE AI pom\u016f\u017ee zv\u00fd\u0161it \u00fasp\u011b\u0161nost va\u0161ich obchodn\u00edch hovor\u016f.`}
              </p>
              <div className="mt-8">
                <Link
                  href="/demo"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group gap-2"
                  )}
                >
                  {`Vyzkou\u0161et demo zdarma`}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-neutral-400">
                {`Bez z\u00e1vazk\u016f. \u017d\u00e1dn\u00e1 kreditn\u00ed karta.`}
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
