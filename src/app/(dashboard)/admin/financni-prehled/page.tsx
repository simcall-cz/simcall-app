"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/auth";

interface Subscription {
  id: string;
  user_id: string | null;
  plan: string;
  tier: number;
  status: string;
  calls_used: number;
  calls_limit: number;
  agents_limit: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  customer_name: string;
  customer_email: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
  billing_method?: string;
}

interface AdminStats {
  mrr: number;
  activeSubscriptions: number;
  totalUsers: number;
  revenueByPlan: Record<string, { count: number; revenue: number }>;
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "secondary" | "default" }
> = {
  active: { label: "Aktivní", variant: "success" },
  past_due: { label: "Po splatnosti", variant: "warning" },
  cancelled: { label: "Zrušeno", variant: "secondary" },
  trialing: { label: "Trial", variant: "default" },
};

const planLabel: Record<string, string> = {
  solo: "Solo",
  team: "Team",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ");
}

export default function FinancniPrehledPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = await getAuthHeaders();
        const [subsRes, statsRes] = await Promise.all([
          fetch("/api/admin/subscriptions", { headers }),
          fetch("/api/admin/stats", { headers }),
        ]);

        if (!subsRes.ok || !statsRes.ok) {
          throw new Error("Nepodařilo se načíst data");
        }

        const subsData = await subsRes.json();
        const statsData = await statsRes.json();

        setSubscriptions(subsData.subscriptions || []);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba při načítání");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-neutral-600">{error || "Nepodařilo se načíst data"}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary-500 hover:underline"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const pastDueSubs = subscriptions.filter((s) => s.status === "past_due");
  const cancelledSubs = subscriptions.filter((s) => s.status === "cancelled");

  const financialStats = [
    {
      label: "MRR",
      value:
        stats.mrr >= 1000
          ? `${(stats.mrr / 1000).toFixed(1)}k Kč`
          : `${stats.mrr.toLocaleString("cs-CZ")} Kč`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "ARR",
      value: `${((stats.mrr * 12) / 1000).toFixed(0)}k Kč`,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Aktivní předplatné",
      value: activeSubs.length.toString(),
      icon: CreditCard,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Po splatnosti",
      value: pastDueSubs.length.toString(),
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">
          Finanční přehled
        </h1>
        <p className="text-neutral-500 mt-1">Tržby, předplatné a fakturace</p>
      </motion.div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue by Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tržby dle plánu</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(stats.revenueByPlan).length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-6">
                Zatím žádné aktivní předplatné
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(stats.revenueByPlan).map(([plan, data]) => (
                  <div
                    key={plan}
                    className="p-4 rounded-lg border border-neutral-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-neutral-700 capitalize">
                        {planLabel[plan] || plan}
                      </span>
                      <Badge variant="secondary">
                        {data.count} předplatitelů
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-neutral-900">
                      {data.revenue.toLocaleString("cs-CZ")} Kč
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">měsíční příjem</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscriptions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Všechna předplatná ({subscriptions.length})</CardTitle>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" /> {activeSubs.length}{" "}
                  aktivních
                </span>
                {pastDueSubs.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Clock className="w-3 h-3" /> {pastDueSubs.length} po
                    splatnosti
                  </span>
                )}
                {cancelledSubs.length > 0 && (
                  <span className="flex items-center gap-1 text-neutral-400">
                    <XCircle className="w-3 h-3" /> {cancelledSubs.length}{" "}
                    zrušených
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">
                Zatím žádná předplatná
              </p>
            ) : (
              <>
                {/* Header */}
                <div className="hidden sm:grid sm:grid-cols-7 gap-3 px-3 py-2 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                  <span className="col-span-2">Zákazník</span>
                  <span>Plán</span>
                  <span className="text-center">Hovory</span>
                  <span>Období</span>
                  <span className="text-right">Cena</span>
                  <span className="text-right">Stav</span>
                </div>
                <div className="space-y-1">
                  {subscriptions.map((sub) => {
                    const config = statusConfig[sub.status] || {
                      label: sub.status,
                      variant: "secondary" as const,
                    };
                    return (
                      <div
                        key={sub.id}
                        className="grid grid-cols-1 sm:grid-cols-7 gap-1 sm:gap-3 px-3 py-3 rounded-lg hover:bg-neutral-50 transition-colors items-center"
                      >
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {sub.customer_name || "Bez jména"}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">
                            {sub.customer_email}
                          </p>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:gap-2">
                          <span className="text-sm text-neutral-700 capitalize">
                            {planLabel[sub.plan] || sub.plan} {sub.tier}
                          </span>
                        </div>
                        <p className="hidden sm:block text-sm text-neutral-600 text-center">
                          {sub.calls_used} / {sub.calls_limit}
                        </p>
                        <p className="hidden sm:block text-xs text-neutral-500">
                          {formatDate(sub.current_period_start)} –{" "}
                          {formatDate(sub.current_period_end)}
                        </p>
                        <p className="hidden sm:block text-sm font-bold text-neutral-900 text-right">
                          {/* We don't store price directly, but can show tier info */}
                          Tier {sub.tier}
                        </p>
                        <div className="flex sm:justify-end">
                          <Badge variant={config.variant}>
                            {config.label}
                          </Badge>
                        </div>
                        {/* Mobile */}
                        <div className="sm:hidden flex flex-col gap-1 mt-1">
                          <p className="text-xs text-neutral-500">
                            {planLabel[sub.plan] || sub.plan} {sub.tier} ·{" "}
                            {sub.calls_used}/{sub.calls_limit} hovorů ·{" "}
                            {config.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
