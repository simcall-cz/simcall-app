"use client";

import Link from "next/link";
import {
  Check,
  ChevronLeft,
  Building2,
} from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";

const enterpriseFeatures = [
  "White-label, SimCall pod vaší značkou",
  "Vlastní AI agenti a scénáře na míru",
  "Dedikovaný account manažer",
  "Počet minut a agentů dohodou",
  "Manager dashboard a analytika týmu",
  "Onboarding a školení celého týmu",
];

export default function DomluvitSchuzku() {
  return (
    <section className="py-12 sm:py-20 bg-neutral-50 min-h-screen">
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

        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
          {/* Left: Info */}
          <div className="xl:w-1/3 shrink-0">
            <ScrollReveal>
              <Badge className="mb-4">Enterprise</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 tracking-tight">
                Domluvte si{" "}
                <GradientText>nezávaznou schůzku</GradientText>
              </h1>
              <p className="mt-4 text-neutral-500 leading-relaxed text-lg">
                Probereme vaše potřeby a připravíme řešení na míru pro váš
                tým. Schůzka trvá přibližně 30 minut.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mt-8 space-y-4">
                {enterpriseFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="mt-10 rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 text-lg">
                      Dedikovaný vývojář
                    </p>
                    <p className="text-sm text-neutral-500">
                      K dispozici přes WhatsApp
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Každý Enterprise klient dostane přímý kontakt na svého
                  osobního vývojáře ze SimCall, který pomůže s čímkoli, od
                  nastavení po nové funkce na míru.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Custom Booking form */}
          <div className="xl:w-2/3">
            <ScrollReveal delay={0.05} className="!h-full">
              <BookingForm />
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
