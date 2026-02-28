"use client";

import { useState, useMemo } from "react";
import { Trophy, Flame, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  dailyStats,
  performanceByCategory,
} from "@/data/dashboard/agent-stats";

type Period = "week" | "month" | "all";

const periodTabs: { key: Period; label: string }[] = [
  { key: "week", label: "Tento týden" },
  { key: "month", label: "Tento měsíc" },
  { key: "all", label: "Celkově" },
];

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

const fillerWordsTrend = [
  { day: "Den 1", count: 15 },
  { day: "Den 2", count: 14 },
  { day: "Den 3", count: 12 },
  { day: "Den 4", count: 11 },
  { day: "Den 5", count: 10 },
  { day: "Den 6", count: 9 },
  { day: "Den 7", count: 8 },
  { day: "Den 8", count: 7 },
  { day: "Den 9", count: 6 },
  { day: "Den 10", count: 5 },
];

const personalRecords = [
  {
    icon: Trophy,
    label: "Nejlepší hovor",
    value: "92%",
    detail: "12. února 2026",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Flame,
    label: "Nejdelší série",
    value: "5 hovorů v řadě",
    detail: "Nad 75% úspěšnost",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: TrendingUp,
    label: "Největší zlepšení",
    value: "Cold calling",
    detail: "+18% za poslední měsíc",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export default function StatistikyPage() {
  const [period, setPeriod] = useState<Period>("all");

  const filteredStats = useMemo(() => {
    const now = new Date();
    if (period === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return dailyStats.filter((d) => new Date(d.date) >= weekAgo);
    }
    if (period === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return dailyStats.filter((d) => new Date(d.date) >= monthAgo);
    }
    return dailyStats;
  }, [period]);

  const chartData = filteredStats.map((d) => ({
    ...d,
    dateLabel: formatDateShort(d.date),
  }));

  const categoryBarColors = [
    "#22c55e",
    "#EF4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Statistiky</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Detailní přehled vašeho výkonu a pokroku
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap gap-2">
        {periodTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPeriod(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              period === tab.key
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Success Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trend úspěšnosti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                    domain={[40, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`${value}%`, "Úspěšnost"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="successRate"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#22c55e" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Calls per Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Počet hovorů za den</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`${value}`, "Hovorů"]}
                  />
                  <Bar dataKey="calls" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Performance by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Výkon podle kategorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceByCategory}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`${value}%`, "Úspěšnost"]}
                  />
                  <Bar dataKey="successRate" radius={[0, 4, 4, 0]}>
                    {performanceByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          categoryBarColors[index % categoryBarColors.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4. Filler Words Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Trend výplňových slov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={fillerWordsTrend}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="fillerGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f59e0b"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [
                      `${value}`,
                      "Výplňových slov",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#fillerGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Records */}
      <Card>
        <CardHeader>
          <CardTitle>Osobní rekordy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {personalRecords.map((record) => (
              <div
                key={record.label}
                className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 bg-white"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl ${record.bg}`}
                >
                  <record.icon className={`w-6 h-6 ${record.color}`} />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">
                    {record.label}
                  </p>
                  <p className="text-base font-semibold text-neutral-900">
                    {record.value}
                  </p>
                  <p className="text-xs text-neutral-500">{record.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
