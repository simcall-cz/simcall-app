"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Phone,
  TrendingUp,
  ArrowRight,
  PhoneCall,
  Loader2,
  PhoneOff,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCallHistory } from "@/hooks/useCallHistory";

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

function formatFullDate(dateStr: string) {
  const date = new Date(dateStr);
  const days = [
    "Neděle",
    "Pondělí",
    "Úterý",
    "Středa",
    "Čtvrtek",
    "Pátek",
    "Sobota",
  ];
  const months = [
    "ledna",
    "února",
    "března",
    "dubna",
    "května",
    "června",
    "července",
    "srpna",
    "září",
    "října",
    "listopadu",
    "prosince",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getSuccessRateBg(rate: number) {
  if (rate >= 70) return "bg-green-50 text-green-700";
  if (rate >= 50) return "bg-yellow-50 text-yellow-700";
  return "bg-red-50 text-red-700";
}

export default function DashboardPage() {
  const today = formatFullDate(new Date().toISOString());
  const { calls, isLoading } = useCallHistory({ limit: 50 });

  const recentCalls = calls.slice(0, 5);

  // Calculate real stats from calls
  const totalCalls = calls.length;
  const completedCalls = calls.filter((c) => c.successRate > 0);
  const avgSuccessRate =
    completedCalls.length > 0
      ? Math.round(
          completedCalls.reduce((sum, c) => sum + c.successRate, 0) /
            completedCalls.length
        )
      : 0;

  // Chart data from real calls (group by date)
  const chartData = useMemo(() => {
    const byDate: Record<string, { calls: number; totalRate: number }> = {};
    calls.forEach((call) => {
      const dateKey = formatDateShort(call.date);
      if (!byDate[dateKey]) {
        byDate[dateKey] = { calls: 0, totalRate: 0 };
      }
      byDate[dateKey].calls += 1;
      byDate[dateKey].totalRate += call.successRate;
    });
    return Object.entries(byDate).map(([dateLabel, data]) => ({
      dateLabel,
      successRate: Math.round(data.totalRate / data.calls),
    }));
  }, [calls]);

  const stats = [
    {
      label: "Celkem hovorů",
      value: totalCalls.toString(),
      icon: Phone,
      bg: "bg-neutral-50",
      iconColor: "text-neutral-600",
    },
    {
      label: "Průměrná úspěšnost",
      value: avgSuccessRate > 0 ? `${avgSuccessRate}%` : "—",
      icon: TrendingUp,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Dobrý den, Roman!
          </h1>
          <p className="text-sm text-neutral-500 mt-1">{today}</p>
        </div>
        <Link href="/dashboard/hovory/novy-hovor">
          <Button>
            <PhoneCall className="w-4 h-4 mr-2" />
            Nový tréninkový hovor
          </Button>
        </Link>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-neutral-500 truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 truncate">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart - only show if we have data */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Výkon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="successGradient"
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
                    formatter={(value: any) => [`${value}%`, "Úspěšnost"]}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    labelFormatter={(label: any) => `Datum: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="successRate"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#successGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Calls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Poslední hovory</CardTitle>
          <Link
            href="/dashboard/hovory"
            className="text-sm text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1"
          >
            Zobrazit vše
            <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : recentCalls.length === 0 ? (
            <div className="text-center py-12">
              <PhoneOff className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-500 font-medium">Zatím žádné hovory</p>
              <p className="text-sm text-neutral-400 mt-1">
                Začněte svůj první tréninkový hovor
              </p>
              <Link href="/dashboard/hovory/novy-hovor">
                <Button className="mt-4" size="sm">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Nový hovor
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-2 font-medium text-neutral-500">
                      Datum
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-500">
                      AI Agent
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-500 hidden sm:table-cell">
                      Scénář
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-neutral-500 hidden md:table-cell">
                      Doba trvání
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-neutral-500">
                      Úspěšnost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((call) => {
                    const callDate = new Date(call.date);
                    const dateStr = `${callDate.getDate()}.${callDate.getMonth() + 1}. ${callDate.getHours()}:${String(callDate.getMinutes()).padStart(2, "0")}`;
                    return (
                      <tr
                        key={call.id}
                        className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors"
                      >
                        <td className="py-3 px-2 text-neutral-600">
                          {dateStr}
                        </td>
                        <td className="py-3 px-2 font-medium text-neutral-800">
                          {call.agentName}
                        </td>
                        <td className="py-3 px-2 text-neutral-600 hidden sm:table-cell">
                          {call.scenario}
                        </td>
                        <td className="py-3 px-2 text-neutral-600 hidden md:table-cell">
                          {call.duration}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Badge
                            className={getSuccessRateBg(call.successRate)}
                          >
                            {call.successRate > 0 ? `${call.successRate}%` : "Čeká..."}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Action */}
      <Card className="border-primary-100 bg-gradient-to-r from-primary-50/50 to-white">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Připraveni na další trénink?
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Začněte nový tréninkový hovor a zlepšete své prodejní dovednosti.
            </p>
          </div>
          <Link href="/dashboard/hovory/novy-hovor">
            <Button size="lg" className="whitespace-nowrap">
              <PhoneCall className="w-5 h-5 mr-2" />
              Nový tréninkový hovor
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
