"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Mail,
  CreditCard,
  Loader2,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

interface SessionDetails {
  plan: string;
  tier: number;
  minutesLimit: number;
  customerEmail: string;
  customerName: string;
  displayName: string;
  isUpgrade: boolean;
  status: string;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isUpgrade = searchParams.get("upgrade") === "true";

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(!!sessionId);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchSession() {
      try {
        const res = await fetch(`/api/stripe/session-details?session_id=${sessionId}`);
        const data = await res.json();
        if (data && !data.error) {
          setSession(data);
        }
      } catch {
        // If fetch fails, we'll show fallback content
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-neutral-500">Načítám detaily objednávky...</p>
        </div>
      </div>
    );
  }

  const displayName = session?.displayName || "váš plán";
  const planLabel = session
    ? `${session.plan === "team" ? "Team" : "Solo"} ${session.minutesLimit} minut`
    : "váš plán";

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="max-w-lg mx-auto py-20 sm:py-32 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            {isUpgrade ? "Upgrade úspěšný!" : "Děkujeme za objednávku!"}
          </h1>

          <p className="text-lg text-neutral-600 mb-8">
            Váš plán{" "}
            <span className="font-semibold text-neutral-900">{displayName}</span>{" "}
            je připraven.
          </p>

          {/* Payment info */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {sessionId ? "Platba úspěšná" : "Objednávka přijata"}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {sessionId
                    ? `Platba byla úspěšně zpracována. Váš plán ${planLabel} je aktivní ihned.`
                    : "Vaše objednávka byla přijata."
                  }
                </p>
              </div>
            </div>

            {/* Auto-created account info */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-start gap-3">
                <UserPlus className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Nový účet?</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Pokud jste ještě neměli účet v SimCall, byl vám{" "}
                    <strong>automaticky vytvořen</strong>. Přihlašovací údaje jsme
                    zaslali na váš e-mail.{" "}
                    <strong>Zkontrolujte prosím i složku spam.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Existing account info */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Máte účet?</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Pokud máte účet se stejným e-mailem, váš balíček byl{" "}
                    <strong>automaticky aktualizován</strong>. Stačí se přihlásit
                    a můžete ihned trénovat.
                  </p>
                </div>
              </div>
            </div>

            {/* Support info */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Problém?</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    V případě jakýchkoliv problémů nás kontaktujte na{" "}
                    <a
                      href="mailto:simcallcz@gmail.com"
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      simcallcz@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/prihlaseni">
              <Button size="lg" className="gap-2">
                Přihlásit se
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/registrace">
              <Button variant="outline" size="lg">
                Vytvořit účet
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

