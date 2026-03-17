"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Phone,
  Trophy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/auth";

interface LeaderboardEntry {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  callsCount: number;
  avgScore: number | null;
}

interface ManagerStats {
  totalCallsThisMonth: number;
  avgTeamScore: number | null;
  topPerformer: {
    userId: string;
    fullName: string;
    avgScore: number | null;
  } | null;
  leaderboard: LeaderboardEntry[];
  callsDistribution: {
    userId: string;
    fullName: string;
    callsCount: number;
  }[];
}

function getBarColor(score: number | null): string {
  if (score === null) return "#d4d4d4";
  if (score > 70) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

const medalColors = ["text-amber-500", "text-neutral-400", "text-amber-700"];

export default function ManagerOverviewPage() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/manager/stats", { headers });
        if (!res.ok) throw new Error("Nepodařilo se načíst statistiky týmu");
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
      label: "Počet členů týmu",
      value: stats.leaderboard.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Průměrné skóre týmu",
      value: stats.avgTeamScore !== null ? `${stats.avgTeamScore}%` : "—",
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Minut tento měsíc",
      value: stats.totalCallsThisMonth,
      icon: Phone,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Top performer",
      value: stats.topPerformer?.fullName?.split(" ")[0] || "—",
      icon: Trophy,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const maxCalls = Math.max(
    ...stats.callsDistribution.map((m) => m.callsCount),
    1
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Přehled týmu</h1>
        <p className="text-neutral-500 mt-1">
          Sledujte výkon vašeho týmu v reálném čase
        </p>
      </motion.div>

      {/* Stat Cards Row */}
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

      {/* Leaderboard + Calls Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Žebříček výkonu</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.leaderboard.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-8">
                  Zatím žádní členové týmu
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.leaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="w-8 text-center">
                        {index < 3 ? (
                          <span className={`text-sm font-bold ${medalColors[index]}`}>{index + 1}.</span>
                        ) : (
                          <span className="text-sm font-bold text-neutral-400">
                            {index + 1}.
                          </span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-semibold shrink-0">
                        {entry.fullName
                          ? entry.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 text-sm truncate">
                          {entry.fullName || entry.email}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {entry.callsCount} minut tento měsíc
                        </p>
                      </div>
                      <Badge
                        variant={
                          entry.avgScore !== null && entry.avgScore >= 70
                            ? "success"
                            : entry.avgScore !== null && entry.avgScore >= 50
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {entry.avgScore !== null
                          ? `${entry.avgScore}%`
                          : "—"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Calls Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Rozložení minut</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.callsDistribution.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-8">
                  Žádné minuty tento měsíc
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.callsDistribution.map((member) => (
                    <div key={member.userId}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-neutral-700 truncate">
                          {member.fullName?.split(" ")[0] || "—"}
                        </span>
                        <span className="text-sm font-bold text-neutral-900">
                          {member.callsCount}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary-500 transition-all"
                          style={{
                            width: `${(member.callsCount / maxCalls) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
