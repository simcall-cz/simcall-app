"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle,
  X,
  ChevronDown,
  Info,
  User,
  Users,
  Building2,
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
  CardFooter,
} from "@/components/ui/card";

import { pricingPlans } from "@/data/pricing";
import { faqItems } from "@/data/faq";
import type { FAQ, PricingPlan } from "@/types";

const pricingFaqs = faqItems.filter(
  (faq: FAQ) => faq.category === "pricing"
);

const planIcons = {
  solo: User,
  team: Users,
  enterprise: Building2,
} as const;

const comparisonFeatures: {
  label: string;
  solo: string | boolean;
  team: string | boolean;
  enterprise: string | boolean;
}[] = [
    {
      label: "Počet minut",
      solo: "100 až 2 000",
      team: "500 až 5 000",
      enterprise: "Individuálně",
    },
    {
      label: "100 lekcí pro cestu k Elitnímu makléři",
      solo: true,
      team: true,
      enterprise: true,
    },
    {
      label: "Volný tréninkový mód (500+ agentů)",
      solo: true,
      team: true,
      enterprise: true,
    },
    { label: "AI analýza hovoru", solo: true, team: true, enterprise: true },
    { label: "Přepis hovoru", solo: true, team: true, enterprise: true },
    {
      label: "Historie hovorů",
      solo: true,
      team: true,
      enterprise: true,
    },
    {
      label: "Nahrávky hovorů (MP3)",
      solo: true,
      team: true,
      enterprise: true,
    },
    {
      label: "Podrobné statistiky",
      solo: true,
      team: true,
      enterprise: true,
    },
    {
      label: "Pokročilá analýza (scoring)",
      solo: true,
      team: true,
      enterprise: true,
    },
    {
      label: "Manager dashboard",
      solo: false,
      team: true,
      enterprise: true,
    },
    { label: "Správa týmu", solo: false, team: true, enterprise: true },
    {
      label: "Analytika zaměstnanců",
      solo: false,
      team: true,
      enterprise: true,
    },
    {
      label: "Žebříčky v týmu",
      solo: false,
      team: true,
      enterprise: true,
    },
    {
      label: "Sdílený pool minut",
      solo: false,
      team: true,
      enterprise: true,
    },
    { label: "Whitelabel", solo: false, team: false, enterprise: true },
    {
      label: "Vlastní AI agenti na míru",
      solo: false,
      team: false,
      enterprise: true,
    },
    {
      label: "Dedikovaný account manažer",
      solo: false,
      team: false,
      enterprise: true,
    },
  ];

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="text-sm font-semibold text-neutral-800 pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">
            <p className="text-sm text-neutral-500 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative group/tip inline-flex ml-1 cursor-help">
      <Info className="h-3.5 w-3.5 text-neutral-400 hover:text-primary-500 transition-colors" />
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-neutral-800 px-3 py-2 text-xs text-white leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity z-50 shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
      </span>
    </span>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const [tierIndex, setTierIndex] = useState(0);
  const Icon = planIcons[plan.id];
  const isEnterprise = plan.id === "enterprise";
  const tier = plan.tiers[tierIndex];

  return (
    <Card
      className={`h-full flex flex-col relative ${plan.highlighted ? "border-2 border-primary-500 shadow-lg" : ""
        }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>Nejoblíbenější</Badge>
        </div>
      )}

      <CardHeader className={plan.highlighted ? "pt-8" : ""}>
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${plan.highlighted
              ? "bg-primary-500 text-white"
              : "bg-neutral-100 text-neutral-600"
              }`}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
        </div>

        {/* Price */}
        <div className="mt-2">
          {isEnterprise ? (
            <div>
              <span className="text-3xl font-bold text-neutral-800">
                Individuální
              </span>
              <p className="text-sm text-neutral-400 mt-1">cena dohodou</p>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-bold text-neutral-800">
                {tier.price.toLocaleString("cs-CZ")} Kč
              </span>
              <span className="text-neutral-400 text-sm">/měsíc</span>
              <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
                <span>{tier.calls} minut</span>
              </div>
            </div>
          )}
        </div>

        <CardDescription className="mt-3">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-5">
        {/* Tier selector */}
        {!isEnterprise && plan.tiers.length > 1 && (
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">
              Počet minut / měsíc
            </label>
            <div className="relative">
              <select
                value={tierIndex}
                onChange={(e) => setTierIndex(Number(e.target.value))}
                className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 pr-10 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
              >
                {plan.tiers.map((t, i) => (
                  <option key={i} value={i}>
                    {t.calls} minut za {t.price.toLocaleString("cs-CZ")} Kč/měsíc
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Features */}
        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li
              key={feature.label}
              className="flex items-start gap-2.5 text-sm text-neutral-600"
            >
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span className="flex items-center flex-wrap gap-0.5">
                {feature.label}
                {feature.tooltip && <Tooltip text={feature.tooltip} />}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link
          href={
            isEnterprise
              ? plan.ctaLink
              : `${plan.ctaLink}?plan=${plan.id}&tier=${tierIndex}`
          }
          className="w-full"
        >
          <Button
            variant={plan.highlighted ? "default" : "outline"}
            className="w-full"
            size="lg"
          >
            {plan.cta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function CenikPage() {
  return (
    <>
      {/* Header Section */}
      <section className="pt-12 sm:pt-16 pb-8 sm:pb-10">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 tracking-tight">
                Vyberte si balíček{" "}
                <GradientText>podle potřeb</GradientText>
              </h1>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} delay={index * 0.05}>
                <PricingCard plan={plan} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Porovnání"
              title="Detailní porovnání plánů"
              subtitle="Podrobný přehled všech funkcí v jednotlivých plánech."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-12 max-w-4xl mx-auto">
              <p className="text-xs text-neutral-400 text-center mb-3 sm:hidden">← Posuňte tabulku pro zobrazení všech plánů →</p>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="py-4 px-4 text-left text-sm font-semibold text-neutral-800 sticky left-0 bg-neutral-50/90 backdrop-blur-sm z-10">
                        Funkce
                      </th>
                      <th className="py-4 px-4 text-center text-sm font-semibold text-neutral-800 min-w-[80px]">
                        Solo
                      </th>
                      <th className="py-4 px-4 text-center text-sm font-semibold text-primary-600 min-w-[80px]">
                        Team
                      </th>
                      <th className="py-4 px-4 text-center text-sm font-semibold text-neutral-800 min-w-[80px]">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature) => (
                      <tr
                        key={feature.label}
                        className="border-b border-neutral-100"
                      >
                        <td className="py-3.5 px-4 text-sm text-neutral-700 sticky left-0 bg-white/90 backdrop-blur-sm z-10">
                          {feature.label}
                        </td>
                        {(["solo", "team", "enterprise"] as const).map(
                          (plan) => (
                            <td
                              key={plan}
                              className="py-3.5 px-4 text-center text-sm"
                            >
                              {typeof feature[plan] === "boolean" ? (
                                feature[plan] ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-neutral-300 mx-auto" />
                                )
                              ) : (
                                <span
                                  className={`font-medium ${plan === "team"
                                    ? "text-primary-600"
                                    : "text-neutral-700"
                                    }`}
                                >
                                  {feature[plan]}
                                </span>
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="FAQ"
              title="Časté dotazy k ceníku"
              subtitle="Odpovědi na nejčastější otázky ohledně cen a fakturace."
            />
          </ScrollReveal>

          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {pricingFaqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 0.05}>
                <FAQItem faq={faq} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-neutral-900">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Připraveni začít?
              </h2>
              <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                Vyberte si balíček a začněte trénovat ještě dnes. Posuňte své
                prodejní dovednosti na další úroveň.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/checkout?plan=solo&tier=0">
                  <Button size="lg" className="group">
                    Začít s Solo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/domluvit-schuzku">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
                  >
                    Enterprise řešení
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
