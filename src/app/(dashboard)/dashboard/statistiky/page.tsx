"use client";

import { useMemo } from "react";
import { Phone, TrendingUp, Clock, Award } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCallHistory } from "@/hooks/useCallHistory";

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

export default function StatistikyPage() {
  const { calls, isLoading } = useCallHistory({ limit: 200 });

  const completedCalls = calls.filter((c) => c.successRate > 0);
  const totalCalls = calls.length;
  const avgScore =
    completedCalls.length > 0
      ? Math.round(
        completedCalls.reduce((sum, c) => sum + c.successRate, 0) /
        completedCalls.length
      )
      : 0;
  const bestScore =
    completedCalls.length > 0
      ? Math.max(...completedCalls.map((c) => c.successRate))
      : 0;
  const totalMinutes = Math.round(
    calls.reduce((sum, c) => {
      const parts = c.duration.split(":");
      return sum + (parseInt(parts[0] || "0") * 60 + parseInt(parts[1] || "0"));
    }, 0) / 60
  );

  // Chart: score over time (grouped by date)
  const scoreOverTime = useMemo(() => {
    const byDate: Record<string, { calls: number; totalRate: number }> = {};
    calls.forEach((call) => {
      if (call.successRate <= 0) return;
      const dateKey = formatDateShort(call.date);
      if (!byDate[dateKey]) {
        byDate[dateKey] = { calls: 0, totalRate: 0 };
      }
      byDate[dateKey].calls += 1;
      byDate[dateKey].totalRate += call.successRate;
    });
    return Object.entries(byDate).map(([dateLabel, data]) => ({
      dateLabel,
      score: Math.round(data.totalRate / data.calls),
    }));
  }, [calls]);

  // Chart: calls per day
  const callsPerDay = useMemo(() => {
    const byDate: Record<string, number> = {};
    calls.forEach((call) => {
      const dateKey = formatDateShort(call.date);
      byDate[dateKey] = (byDate[dateKey] || 0) + 1;
    });
    return Object.entries(byDate).map(([dateLabel, count]) => ({
      dateLabel,
      count,
    }));
  }, [calls]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-30", count: 0, color: "#EF4444" },
      { range: "31-50", count: 0, color: "#F59E0B" },
      { range: "51-70", count: 0, color: "#3B82F6" },
      { range: "71-100", count: 0, color: "#22C55E" },
    ];
    completedCalls.forEach((c) => {
      if (c.successRate <= 30) buckets[0].count++;
      else if (c.successRate <= 50) buckets[1].count++;
      else if (c.successRate <= 70) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [completedCalls]);

  const statCards = [
    {
      label: "Celkem hovorů",
      value: totalCalls.toString(),
      icon: Phone,
      bg: "bg-neutral-50",
      iconColor: "text-neutral-600",
    },
    {
      label: "Průměrné skóre",
      value: avgScore > 0 ? `${avgScore}%` : "—",
      icon: TrendingUp,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Nejlepší skóre",
      value: bestScore > 0 ? `${bestScore}%` : "—",
      icon: Award,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Celkový čas tréninku",
      value: totalMinutes > 0 ? `${totalMinutes} min` : "—",
      icon: Clock,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Statistiky</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Přehled vašeho pokroku z reálných hovorů
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No data state */}
      {totalCalls === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Phone className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
            <p className="text-neutral-500 font-medium">
              Zatím žádná data
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Zrealizujte první tréninkový hovor pro zobrazení statistik
            </p>
          </CardContent>
        </Card>
      )}

      {/* Score over time */}
      {scoreOverTime.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Vývoj skóre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={scoreOverTime}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="scoreGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#EF4444"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="#EF4444"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value}%`, "Skóre"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#scoreGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calls per day + Score distribution */}
      {completedCalls.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls per day */}
          {callsPerDay.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Počet hovorů za den</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={callsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="dateLabel"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip />
                      <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Score distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rozložení skóre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
