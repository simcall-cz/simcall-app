"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle,
  X,
  ChevronDown,
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
import type { FAQ } from "@/types";

const pricingFaqs = faqItems.filter(
  (faq: FAQ) => faq.category === "pricing"
);

const comparisonFeatures: {
  label: string;
  starter: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
}[] = [
    {
      label: "Počet AI agentů",
      starter: "5",
      professional: "10",
      enterprise: "10 + vlastní",
    },
    {
      label: "Počet scénářů",
      starter: "5",
      professional: "Všechny + vlastní",
      enterprise: "Neomezené",
    },
    {
      label: "Hovory za měsíc",
      starter: "20",
      professional: "Neomezené",
      enterprise: "Neomezené",
    },
    {
      label: "Analýza hovorů",
      starter: "Základní",
      professional: "Pokročilá",
      enterprise: "Pokročilá",
    },
    { label: "Přepis hovoru", starter: true, professional: true, enterprise: true },
    {
      label: "Gamifikace",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      label: "Manažerský dashboard",
      starter: false,
      professional: false,
      enterprise: true,
    },
    {
      label: "API přístup",
      starter: false,
      professional: false,
      enterprise: true,
    },
    {
      label: "Prioritní podpora",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      label: "Vlastní scénáře",
      starter: false,
      professional: true,
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
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-sm text-neutral-500 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CenikPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      {/* Header Section */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4">Ceník</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-800 tracking-tight">
                Jednoduchý a{" "}
                <GradientText>transparentní</GradientText> ceník
              </h1>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                Vyberte si plán, který odpovídá vašim potřebám. Všechny plány
                zahrnují 14denní bezplatnou zkušební verzi bez nutnosti
                zadávat platební údaje.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Billing Toggle + Pricing Cards */}
      <section className="pb-16 sm:pb-20">
        <Container>
          {/* Billing Toggle */}
          <ScrollReveal>
            <div className="flex items-center justify-center gap-4 mb-12">
              <span
                className={`text-sm font-medium ${!isAnnual ? "text-neutral-800" : "text-neutral-400"
                  }`}
              >
                Měsíčně
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isAnnual ? "bg-primary-500" : "bg-neutral-300"
                  }`}
                aria-label="Přepnout na roční fakturaci"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isAnnual ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${isAnnual ? "text-neutral-800" : "text-neutral-400"
                  }`}
              >
                Ročně
              </span>
              {isAnnual && (
                <Badge variant="success" className="ml-1">
                  Ušetřete 15 %
                </Badge>
              )}
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} delay={index * 0.05}>
                <Card
                  className={`h-full flex flex-col relative ${plan.highlighted
                      ? "border-2 border-primary-500 shadow-lg"
                      : ""
                    }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Nejoblíbenější</Badge>
                    </div>
                  )}
                  <CardHeader className={plan.highlighted ? "pt-8" : ""}>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-neutral-800">
                        {isAnnual ? plan.priceAnnual : plan.price}
                      </span>
                    </div>
                    <CardDescription className="mt-3">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-neutral-600"
                        >
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/demo" className="w-full">
                      <Button
                        variant={plan.highlighted ? "default" : "outline"}
                        className="w-full"
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
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
            <div className="mt-12 max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-neutral-800">
                      Funkce
                    </th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-neutral-800">
                      Starter
                    </th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-primary-600">
                      Professional
                    </th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-neutral-800">
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
                      <td className="py-3.5 px-4 text-sm text-neutral-700">
                        {feature.label}
                      </td>
                      {(
                        ["starter", "professional", "enterprise"] as const
                      ).map((plan) => (
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
                              className={`font-medium ${plan === "professional"
                                  ? "text-primary-600"
                                  : "text-neutral-700"
                                }`}
                            >
                              {feature[plan]}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
                Vyzkoušejte SimCall zdarma na 14 dní. Žádná platební karta,
                žádné závazky.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    Začít zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pro-manazery">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
                  >
                    Řešení pro týmy
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
