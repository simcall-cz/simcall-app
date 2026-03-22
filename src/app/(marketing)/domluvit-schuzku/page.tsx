"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { InlineWidget } from "react-calendly";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";

const timeSlots = {
  morning: [
    { time: "9:00", label: "9:00" },
    { time: "10:00", label: "10:00" },
    { time: "11:00", label: "11:00" },
  ],
  afternoon: [
    { time: "14:00", label: "14:00" },
    { time: "15:00", label: "15:00" },
    { time: "16:00", label: "16:00" },
  ],
};

const enterpriseFeatures = [
  "White-label, SimCall pod vaší značkou",
  "Vlastní AI agenti a scénáře na míru",
  "Dedikovaný account manažer",
  "Počet minut a agentů dohodou",
  "Manager dashboard a analytika týmu",
  "Onboarding a školení celého týmu",
];

function getNextBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  let current = new Date(today);
  current.setDate(current.getDate() + 1);

  while (days.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
}

export default function DomluvitSchuzku() {
  // Zde vložíte přesný odkaz na váš Calendly profil/událost
  const calendlyUrl = "https://calendly.com/simcallcz/new-meeting";

  return (
    <>
      <section className="py-12 sm:py-20">
        <Container>
          <ScrollReveal>
            <Link
              href="/cenik"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
            >
              <ChevronLeft className="h-4 w-4" />
              Zpět na ceník
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <Badge className="mb-4">Enterprise</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                  Domluvte si{" "}
                  <GradientText>nezávaznou schůzku</GradientText>
                </h1>
                <p className="mt-4 text-neutral-500 leading-relaxed">
                  Probereme vaše potřeby a připravíme řešení na míru pro váš
                  tým. Schůzka trvá přibližně 30 minut.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="mt-8 space-y-3">
                  {enterpriseFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="mt-8 rounded-xl bg-neutral-50 border border-neutral-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">
                        Dedikovaný vývojář
                      </p>
                      <p className="text-xs text-neutral-500">
                        K dispozici přes WhatsApp
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Každý Enterprise klient dostane přímý kontakt na svého
                    osobního vývojáře ze SimCall, který pomůže s čímkoli, od
                    nastavení po nové funkce na míru.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Booking form via Calendly */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.05}>
                <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden h-[700px]">
                  <InlineWidget
                    url={calendlyUrl}
                    styles={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
