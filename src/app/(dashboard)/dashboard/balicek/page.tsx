"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  ArrowUpRight,
  Loader2,
  Phone,
  Users,
  Zap,
  TrendingUp,
  Calendar,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface SubscriptionData {
  plan: string;
  tier: number;
  minutesUsed: number;
  minutesLimit: number;
  agentsLimit: number;
  status: string;
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
  isTeamMember?: boolean;
  managerEmail?: string;
  teamMinutesUsed?: number;
  scheduledPlan?: string | null;
  scheduledTier?: number | null;
  billingMethod?: string;
}

const planLabels: Record<string, string> = {
  demo: "Free",
  solo: "Solo",
  team: "Team",
};

const tierDetails: Record<string, { minutes: number; price: number }[]> = {
  solo: [
    { minutes: 100, price: 990 },
    { minutes: 250, price: 2490 },
    { minutes: 500, price: 4990 },
    { minutes: 1000, price: 9990 },
    { minutes: 1500, price: 14990 },
    { minutes: 2000, price: 19990 },
  ],
  team: [
    { minutes: 500, price: 7490 },
    { minutes: 1000, price: 14990 },
    { minutes: 2500, price: 37490 },
    { minutes: 5000, price: 74990 },
  ],
};

function getDaysRemaining(endDate: string): number {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function BalicekPage() {
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [upgradingTier, setUpgradingTier] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/subscription", { headers });
        const data = await res.json();
        if (data && !data.error) setSub(data);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handlePortal() {
    setIsPortalLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent
    } finally {
      setIsPortalLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!sub) return null;

  const isPaid = sub.plan !== "demo";
  const isTeamMember = !!sub.isTeamMember;

  // For team members, show team-wide usage for pool visibility
  const displayMinutesUsed = isTeamMember && sub.teamMinutesUsed !== undefined
    ? sub.teamMinutesUsed
    : sub.minutesUsed;
  const usagePercent = sub.minutesLimit > 0
    ? Math.min(100, Math.round((displayMinutesUsed / sub.minutesLimit) * 100))
    : 0;
  const remaining = Math.max(0, sub.minutesLimit - displayMinutesUsed);
  const daysLeft = sub.currentPeriodEnd ? getDaysRemaining(sub.currentPeriodEnd) : null;
  const currentTiers = tierDetails[sub.plan] || [];
  const currentTierIndex = currentTiers.findIndex((t) => t.minutes === sub.minutesLimit);
  const currentTierPrice = currentTierIndex >= 0 ? currentTiers[currentTierIndex].price : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Můj balíček</h1>
        <p className="text-neutral-500 mt-1">
          Správa vašeho předplatného a minut
        </p>
      </motion.div>

      {/* Plan Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    {planLabels[sub.plan] || sub.plan}
                    {isPaid && (
                      <span className="text-neutral-400 font-normal ml-2 text-sm">
                        · {sub.minutesLimit} minut/měs
                      </span>
                    )}
                  </h2>
                  <Badge variant={isPaid ? "success" : "secondary"}>
                    {isPaid ? (isTeamMember ? "Člen týmu" : "Aktivní") : "Demo účet"}
                  </Badge>
                  {isTeamMember && sub.managerEmail && (
                    <span className="text-xs text-neutral-500 ml-2">
                      Manažer: <span className="font-medium text-neutral-700">{sub.managerEmail}</span>
                    </span>
                  )}
                </div>
              </div>
              {isPaid && sub.stripeCustomerId && !isTeamMember && sub.billingMethod !== "invoice" && (
                <Button
                  onClick={handlePortal}
                  disabled={isPortalLoading}
                  variant="outline"
                  className="gap-2"
                >
                  {isPortalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                  Stripe portál
                </Button>
              )}
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-2 ${isTeamMember ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-4 mb-6`}>
              {isTeamMember && sub.teamMinutesUsed !== undefined && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-600">Tým celkem</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {sub.teamMinutesUsed}
                    <span className="text-sm font-normal text-purple-400">
                      /{sub.minutesLimit}
                    </span>
                  </p>
                </div>
              )}
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500">{isTeamMember ? "Moje minuty" : "Minuty"}</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {sub.minutesUsed}
                  <span className="text-sm font-normal text-neutral-400">
                    {!isTeamMember && `/${sub.minutesLimit}`}
                  </span>
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Zbývá</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {remaining}
                  <span className="text-sm font-normal text-neutral-400"> minut</span>
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Obnovení</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {daysLeft !== null ? (
                    <>
                      {daysLeft}
                      <span className="text-sm font-normal text-neutral-400"> dní</span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>

            {/* Usage Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">
                  {isTeamMember ? "Využití minut celého týmu" : "Využití minut tento měsíc"}
                </span>
                <span className="text-sm font-medium text-neutral-900">
                  {usagePercent}%
                </span>
              </div>
              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    usagePercent >= 90
                      ? "bg-red-500"
                      : usagePercent >= 70
                      ? "bg-amber-500"
                      : "bg-primary-500"
                  }`}
                />
              </div>
            </div>

            {/* Rebill date */}
            {sub.currentPeriodEnd && (
              <p className="text-xs text-neutral-400 mt-3">
                Další obnova: {new Date(sub.currentPeriodEnd).toLocaleDateString("cs-CZ")}
                {daysLeft !== null && ` (za ${daysLeft} dní)`}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Scheduled downgrade banner */}
      {sub.scheduledPlan && sub.scheduledTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <ArrowDown className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800">
                    Plánovaná změna: {sub.scheduledPlan.toUpperCase()} {sub.scheduledTier}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Aktivuje se {sub.currentPeriodEnd
                      ? new Date(sub.currentPeriodEnd).toLocaleDateString("cs-CZ")
                      : "na konci aktuálního období"
                    }. Do té doby máte aktuální balíček.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Team member info */}
      {isTeamMember && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">
                    Váš balíček spravuje manažer týmu
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Upgrade a downgrade balíčku může provádět pouze manažer vašeho týmu. Pokud potřebujete změnu, kontaktujte svého manažera.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upgrade / Downgrade Options — only for solo/team_manager, NOT team members */}
      {isPaid && !isTeamMember && currentTiers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                Změnit balíček
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Přejděte na jiný tier. Při upgradu zaplatíte fixní doplatek (rozdíl cen), den obnovení se nemění.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentTiers.map((t, idx) => {
                  const isCurrentTier = idx === currentTierIndex;
                  const isUpgrade = idx > currentTierIndex;
                  const isUpgradingThis = upgradingTier === t.minutes;
                  const isScheduledTier = sub.scheduledTier === t.minutes && sub.scheduledPlan === sub.plan;
                  return (
                    <button
                      key={idx}
                      disabled={isCurrentTier || isScheduledTier || upgradingTier !== null}
                      onClick={async () => {
                        if (isCurrentTier || isScheduledTier) return;

                        // Confirm downgrade
                        if (!isUpgrade) {
                          const confirmed = window.confirm(
                            `Opravdu chcete downgrade na ${t.minutes} minut? Změna se projeví na konci aktuálního období.`
                          );
                          if (!confirmed) return;
                        }
                        setUpgradingTier(t.minutes);
                        try {
                          const headers = await getAuthHeaders();
                          const res = await fetch("/api/stripe/create-upgrade-session", {
                            method: "POST",
                            headers: { ...headers, "Content-Type": "application/json" },
                            body: JSON.stringify({
                              plan: sub.plan,
                              tier: t.minutes,
                            }),
                          });
                          const data = await res.json();
                          if (data.upgraded) {
                            // Direct upgrade succeeded — reload page
                            window.location.reload();
                          } else if (data.scheduled) {
                            // Downgrade scheduled — reload to show banner
                            alert(data.message || "Downgrade naplánován");
                            window.location.reload();
                          } else if (data.url) {
                            // Redirect to Stripe checkout
                            window.location.href = data.url;
                          } else {
                            alert(data.error || "Nepodařilo se provést změnu");
                          }
                        } catch {
                          alert("Chyba při změně plánu");
                        } finally {
                          setUpgradingTier(null);
                        }
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isCurrentTier
                          ? "border-primary-300 bg-primary-50 cursor-default"
                          : isScheduledTier
                          ? "border-amber-300 bg-amber-50 cursor-default"
                          : "border-neutral-200 bg-white hover:border-primary-300 hover:shadow-sm cursor-pointer"
                      } ${upgradingTier !== null && !isUpgradingThis ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-neutral-900">
                          {t.minutes} minut
                        </span>
                        {isCurrentTier ? (
                          <Badge variant="default">Aktuální</Badge>
                        ) : isScheduledTier ? (
                          <Badge variant="warning">Plánováno</Badge>
                        ) : isUpgradingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                        ) : isUpgrade ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-lg font-bold text-neutral-900">
                        {t.price.toLocaleString("cs-CZ")} Kč
                        <span className="text-xs font-normal text-neutral-400">/měs</span>
                      </p>
                      {!isCurrentTier && !isScheduledTier && isUpgrade && (
                        <p className="text-xs text-green-600 mt-1">
                          Doplatek: {(t.price - currentTierPrice).toLocaleString("cs-CZ")} Kč
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Free → Paid CTA */}
      {!isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900">
                    Upgradujte na placený plán
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Získejte více minut a pokročilé funkce. Vyberte si z plánu Solo (od 990 Kč) nebo Team (od 7 490 Kč).
                  </p>
                </div>
                <Button
                  onClick={() => (window.location.href = "/cenik")}
                  className="shrink-0"
                >
                  Zobrazit ceník
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

    </div>
  );
}
