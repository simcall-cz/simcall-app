"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Mail, CreditCard, FileText } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan") || "solo";
  const tier = searchParams.get("tier") || "50";

  const isStripe = !!sessionId;

  const planName = plan === "team" ? "Team" : "Solo";
  const displayName = `${planName} ${tier}`;

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="max-w-lg mx-auto py-20 sm:py-32 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            Děkujeme za objednávku!
          </h1>

          <p className="text-lg text-neutral-600 mb-8">
            Váš plán <span className="font-semibold text-neutral-900">{displayName}</span> je připraven.
          </p>

          {/* Payment method info */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-start gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {isStripe ? "Platba úspěšná" : "Objednávka přijata"}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {isStripe
                    ? "Platba byla úspěšně zpracována. Váš plán je aktivní ihned."
                    : "Vaše objednávka byla přijata."
                  }
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Propojení s účtem</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Pokud ještě nemáte účet, vytvořte si ho. Do <strong>60 minut</strong> bude váš účet automaticky napojený na zakoupený plán.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/registrace">
              <Button size="lg" className="gap-2">
                Vytvořit účet
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/prihlaseni">
              <Button variant="outline" size="lg">
                Přihlásit se
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-neutral-400">
            Máte otázky? Napište nám na{" "}
            <a href="mailto:simcallcz@gmail.com" className="text-primary-500 hover:text-primary-600">
              simcallcz@gmail.com
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function DekujemePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
