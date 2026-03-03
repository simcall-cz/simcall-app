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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface SubscriptionData {
  plan: string;
  tier: number;
  callsUsed: number;
  callsLimit: number;
  agentsLimit: number;
  status: string;
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
}

const planLabels: Record<string, string> = {
  demo: "Free",
  solo: "Solo",
  team: "Team",
};

export default function BalicekPage() {
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

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

  const usagePercent = sub.callsLimit > 0
    ? Math.min(100, Math.round((sub.callsUsed / sub.callsLimit) * 100))
    : 0;
  const remaining = Math.max(0, sub.callsLimit - sub.callsUsed);
  const isPaid = sub.plan !== "demo";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Můj balíček</h1>
        <p className="text-neutral-500 mt-1">
          Správa vašeho předplatného a hovorů
        </p>
      </motion.div>

      {/* Plan Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
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
                        Tier {sub.tier}
                      </span>
                    )}
                  </h2>
                  <Badge variant={isPaid ? "success" : "secondary"}>
                    {isPaid ? "Aktivní" : "Demo účet"}
                  </Badge>
                </div>
              </div>
              {isPaid && sub.stripeCustomerId && (
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
                  Spravovat předplatné
                </Button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Hovory</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {sub.callsUsed}
                  <span className="text-sm font-normal text-neutral-400">
                    /{sub.callsLimit}
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
                  <span className="text-sm font-normal text-neutral-400"> hovorů</span>
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Agenti</span>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {sub.agentsLimit}
                </p>
              </div>
            </div>

            {/* Usage Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">
                  Využití hovorů tento měsíc
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
              {usagePercent >= 80 && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Blížíte se k limitu hovorů. Zvažte upgrade balíčku.
                </p>
              )}
            </div>

            {/* Upgrade CTA */}
            {!isPaid && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 text-sm">
                      Upgradujte na placený plán
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Získejte více hovorů, agentů a pokročilé funkce
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => (window.location.href = "/cenik")}
                    className="shrink-0"
                  >
                    Ceník
                  </Button>
                </div>
              </div>
            )}

            {isPaid && usagePercent >= 90 && !sub.stripeCustomerId && (
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 text-sm">
                      Zvyšte svůj balíček
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Vaše hovory dochází. Přejděte na vyšší tier.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => (window.location.href = "/cenik")}
                    className="shrink-0"
                  >
                    Ceník
                  </Button>
                </div>
              </div>
            )}

            {sub.currentPeriodEnd && (
              <p className="text-xs text-neutral-400 mt-4">
                Další obnova:{" "}
                {new Date(sub.currentPeriodEnd).toLocaleDateString("cs-CZ")}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
