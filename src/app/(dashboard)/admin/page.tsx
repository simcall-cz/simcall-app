"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Phone,
  DollarSign,
  CreditCard,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/auth";

interface AdminStats {
  totalUsers: number;
  totalCalls: number;
  activeSubscriptions: number;
  mrr: number;
  callsToday: number;
  recentRegistrations: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
  }[];
  revenueByPlan: Record<string, { count: number; revenue: number }>;
}

const planBadgeColor: Record<
  string,
  "default" | "secondary" | "success" | "warning"
> = {
  demo: "secondary",
  solo: "default",
  team: "success",
  admin: "warning",
};

const planLabel: Record<string, string> = {
  demo: "Demo",
  solo: "Solo",
  team: "Team",
  admin: "Admin",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}.${d.getMonth() + 1}. ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/admin/stats", { headers });
        if (!res.ok) throw new Error("Nepodařilo se načíst statistiky");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba při načítání");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
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

  const statCards = [
    {
      label: "Celkem uživatelů",
      value: stats.totalUsers.toLocaleString("cs-CZ"),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Celkem minut",
      value: stats.totalCalls.toLocaleString("cs-CZ"),
      icon: Phone,
      color: "bg-purple-50 text-purple-600",
    },
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
      label: "Aktivní předplatitelé",
      value: stats.activeSubscriptions.toString(),
      icon: CreditCard,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const revenueByPlanEntries = Object.entries(stats.revenueByPlan);
  const planColors: Record<string, string> = {
    solo: "#ef4444",
    team: "#3b82f6",
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">
          Přehled platformy
        </h1>
        <p className="text-neutral-500 mt-1">
          Celkové statistiky SimCall
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
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

      {/* Revenue by Plan + Calls Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {revenueByPlanEntries.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-8">
                  Zatím žádné aktivní předplatné
                </p>
              ) : (
                <div className="space-y-4">
                  {revenueByPlanEntries.map(([plan, data]) => {
                    const totalMrr = stats.mrr || 1;
                    const percentage = Math.round(
                      (data.revenue / totalMrr) * 100
                    );
                    return (
                      <div key={plan}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-sm"
                              style={{
                                backgroundColor:
                                  planColors[plan] || "#6b7280",
                              }}
                            />
                            <span className="text-sm font-medium text-neutral-700 capitalize">
                              {planLabel[plan] || plan}
                            </span>
                            <Badge variant="secondary" className="text-[10px]">
                              {data.count} předplatitelů
                            </Badge>
                          </div>
                          <span className="text-sm font-bold text-neutral-900">
                            {data.revenue.toLocaleString("cs-CZ")} Kč/měs
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                planColors[plan] || "#6b7280",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-3 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-500">
                        Celkové MRR
                      </span>
                      <span className="text-lg font-bold text-neutral-900">
                        {stats.mrr.toLocaleString("cs-CZ")} Kč
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      ARR:{" "}
                      {(stats.mrr * 12).toLocaleString("cs-CZ")} Kč
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dnešní aktivita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Minut dnes
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats.callsToday}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Registrovaných celkem
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats.totalUsers}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Konverzní poměr
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats.totalUsers > 0
                      ? `${Math.round(
                          (stats.activeSubscriptions / stats.totalUsers) * 100
                        )}%`
                      : "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Registrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Poslední registrace</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentRegistrations.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">
                Zatím žádné registrace
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-semibold shrink-0">
                      {reg.full_name
                        ? reg.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : reg.email?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {reg.full_name || "Bez jména"}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {reg.email}
                      </p>
                    </div>
                    <Badge
                      variant={planBadgeColor[reg.role] || "secondary"}
                    >
                      {planLabel[reg.role] || reg.role}
                    </Badge>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDate(reg.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
