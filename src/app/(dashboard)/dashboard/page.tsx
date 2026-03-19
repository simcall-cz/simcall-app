"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  TrendingUp,
  ArrowRight,
  PhoneCall,
  Loader2,
  PhoneOff,
  Crown,
  Lock,
  Zap,
  Check,
  BarChart3,
  Sparkles,
  AlertTriangle,
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
import { getUserSessionInfo, getAuthHeaders } from "@/lib/auth";

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

interface SubscriptionInfo {
  plan: string;
  tier: number;
  minutesUsed: number;
  minutesLimit: number;
  agentsLimit: number;
  status: string;
  currentPeriodEnd?: string;
}

/* ============================================================
   FREE DASHBOARD — limited view with upgrade CTAs
   ============================================================ */
function FreeDashboard({
  userName,
  today,
  calls,
  isLoading,
  subscription,
}: {
  userName: string;
  today: string;
  calls: ReturnType<typeof useCallHistory>["calls"];
  isLoading: boolean;
  subscription: SubscriptionInfo;
}) {
  const callsRemaining = Math.max(
    0,
    subscription.minutesLimit - subscription.minutesUsed
  );
  const recentCalls = calls.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Free badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">
              Dobrý den, {userName}!
            </h1>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Demo
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">{today}</p>
        </div>
        {callsRemaining > 0 ? (
          <Link href="/dashboard/hovory/novy-hovor">
            <Button>
              <PhoneCall className="w-4 h-4 mr-2" />
              Nový hovor ({callsRemaining}/{subscription.minutesLimit})
            </Button>
          </Link>
        ) : (
          <Link href="/cenik">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade — limit vyčerpán
            </Button>
          </Link>
        )}
      </div>

      {/* Usage Meter */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-500" />
              <span className="text-sm font-medium text-neutral-700">
                Využití demo minut celkem
              </span>
            </div>
            <span className="text-sm font-bold text-neutral-900">
              {subscription.minutesUsed} / {subscription.minutesLimit}
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${subscription.minutesUsed >= subscription.minutesLimit
                ? "bg-red-500"
                : "bg-primary-500"
                }`}
              style={{
                width: `${Math.min(100, (subscription.minutesUsed / subscription.minutesLimit) * 100)}%`,
              }}
            />
          </div>
          {subscription.minutesUsed >= subscription.minutesLimit && (
            <p className="text-xs text-red-500 mt-2">
              Dosáhli jste limitu {subscription.minutesLimit} minut v demo verzi.
              Vyberte plán pro více minut.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50">
                <Phone className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-neutral-500 truncate">
                  Celkem minut
                </p>
                <p className="text-lg font-semibold text-neutral-900 truncate">
                  {isLoading ? "..." : subscription.minutesUsed.toString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50">
                <BarChart3 className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-neutral-500 truncate">
                  Detailní statistiky
                </p>
                <p className="text-sm text-neutral-400 truncate">
                  Pouze v placeném plánu
                </p>
              </div>
              <Lock className="w-4 h-4 text-neutral-300 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls (limited to 3) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Poslední hovory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : recentCalls.length === 0 ? (
            <div className="text-center py-12">
              <PhoneOff className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-500 font-medium">
                Zatím žádné hovory
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Začněte svůj první tréninkový hovor
              </p>
              {callsRemaining > 0 && (
                <Link href="/dashboard/hovory/novy-hovor">
                  <Button className="mt-4" size="sm">
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Nový hovor
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="sm:hidden space-y-3">
                {recentCalls.map((call) => {
                  const callDate = new Date(call.date);
                  const dateStr = `${callDate.getDate()}.${callDate.getMonth() + 1}. ${callDate.getHours()}:${String(callDate.getMinutes()).padStart(2, "0")}`;
                  return (
                    <div key={call.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-25">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-800">{call.agentName}</span>
                        <Badge className={getSuccessRateBg(call.successRate)}>
                          {call.successRate > 0 ? `${call.successRate}%` : "Čeká..."}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{dateStr}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{call.scenario}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Desktop: table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left py-3 px-2 font-medium text-neutral-500">Datum</th>
                      <th className="text-left py-3 px-2 font-medium text-neutral-500">AI Agent</th>
                      <th className="text-left py-3 px-2 font-medium text-neutral-500">Scénář</th>
                      <th className="text-right py-3 px-2 font-medium text-neutral-500">Úspěšnost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCalls.map((call) => {
                      const callDate = new Date(call.date);
                      const dateStr = `${callDate.getDate()}.${callDate.getMonth() + 1}. ${callDate.getHours()}:${String(callDate.getMinutes()).padStart(2, "0")}`;
                      return (
                        <tr key={call.id} className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors">
                          <td className="py-3 px-2 text-neutral-600">{dateStr}</td>
                          <td className="py-3 px-2 font-medium text-neutral-800">{call.agentName}</td>
                          <td className="py-3 px-2 text-neutral-600">{call.scenario}</td>
                          <td className="py-3 px-2 text-right">
                            <Badge className={getSuccessRateBg(call.successRate)}>
                              {call.successRate > 0 ? `${call.successRate}%` : "Čeká..."}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Locked features preview */}
      <Card className="relative overflow-hidden border-neutral-200">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white z-10 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-400">
            <Lock className="w-4 h-4" />
            Graf výkonu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center relative z-20">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-neutral-200" />
              <p className="text-sm text-neutral-400">
                Detailní grafy dostupné v placeném plánu
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-bold text-neutral-900">
                  Vyberte svůj plán
                </h3>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                Odemkněte plný potenciál SimCall pro vaše obchodní dovednosti.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  "Až 1 000 minut/měsíc (Solo plán)",
                  "500 AI agentů k výběru",
                  "Detailní AI analýza hovoru",
                  "Přepis hovoru",
                  "Sledování pokroku a grafy",
                  "Personalizovaná doporučení",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-neutral-600"
                  >
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <p className="text-2xl font-bold text-neutral-900">od 990 Kč</p>
              <p className="text-xs text-neutral-400 mb-3">/ měsíc</p>
              <Link href="/cenik">
                <Button size="lg" className="whitespace-nowrap">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Vybrat plán
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   PAID DASHBOARD — full dashboard with usage tracking
   ============================================================ */
function PaidDashboard({
  userName,
  today,
  calls,
  isLoading,
  totalMinutes,
  avgSuccessRate,
  chartData,
  subscription,
}: {
  userName: string;
  today: string;
  calls: ReturnType<typeof useCallHistory>["calls"];
  isLoading: boolean;
  totalMinutes: number;
  avgSuccessRate: number;
  chartData: { dateLabel: string; successRate: number }[];
  subscription: SubscriptionInfo;
}) {
  const recentCalls = calls.slice(0, 5);
  const callsRemaining = Math.max(
    0,
    subscription.minutesLimit - subscription.minutesUsed
  );
  const usagePercentage = Math.min(
    100,
    Math.round((subscription.minutesUsed / subscription.minutesLimit) * 100)
  );
  const isLowOnCalls = usagePercentage >= 80;
  const isOutOfCalls = subscription.minutesUsed >= subscription.minutesLimit;

  const planLabel =
    subscription.plan === "solo"
      ? "Solo"
      : subscription.plan === "team"
        ? "Team"
        : subscription.plan;

  const stats = [
    {
      label: "Celkem minut",
      value: totalMinutes > 0 ? totalMinutes.toString() : "—",
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">
              Dobrý den, {userName}!
            </h1>
            <Badge variant="default" className="text-xs capitalize">
              {planLabel} {subscription.tier}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">{today}</p>
        </div>
        {isOutOfCalls ? (
          <Link href="/cenik">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Crown className="w-4 h-4 mr-2" />
              Zvýšit limit
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/hovory/novy-hovor">
            <Button>
              <PhoneCall className="w-4 h-4 mr-2" />
              Nový tréninkový hovor
            </Button>
          </Link>
        )}
      </div>

      {/* Subscription Usage Meter */}
      <Card
        className={
          isLowOnCalls
            ? "border-amber-200"
            : isOutOfCalls
              ? "border-red-200"
              : ""
        }
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-500" />
              <span className="text-sm font-medium text-neutral-700">
                Využití minut ({planLabel} {subscription.tier})
              </span>
            </div>
            <span className="text-sm font-bold text-neutral-900">
              {subscription.minutesUsed} / {subscription.minutesLimit}
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${isOutOfCalls
                ? "bg-red-500"
                : isLowOnCalls
                  ? "bg-amber-500"
                  : "bg-primary-500"
                }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-neutral-400">
              Zbývá {callsRemaining} minut
            </p>
            {subscription.currentPeriodEnd && (
              <p className="text-xs text-neutral-400">
                Obnovení:{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  "cs-CZ"
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low on calls warning */}
      {isLowOnCalls && !isOutOfCalls && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                Blížíte se limitu minut
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Dochází vám minuty. Zbývá {callsRemaining} minut. Zvyšte limit pro
                nepřerušený trénink.
              </p>
            </div>
            <Link href="/cenik">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0">
                Zvýšit limit
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Out of calls CTA */}
      {isOutOfCalls && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Vyčerpali jste limit minut
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Pro pokračování v tréninku přejděte na vyšší balíček.
              </p>
            </div>
            <Link href="/cenik">
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white shrink-0">
                <Crown className="w-4 h-4 mr-1" />
                Zvýšit balíček
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

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
              <p className="text-neutral-500 font-medium">
                Zatím žádné hovory
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Začněte svůj první tréninkový hovor
              </p>
              {!isOutOfCalls && (
                <Link href="/dashboard/hovory/novy-hovor">
                  <Button className="mt-4" size="sm">
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Nový hovor
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="sm:hidden space-y-3">
                {recentCalls.map((call) => {
                  const callDate = new Date(call.date);
                  const dateStr = `${callDate.getDate()}.${callDate.getMonth() + 1}. ${callDate.getHours()}:${String(callDate.getMinutes()).padStart(2, "0")}`;
                  return (
                    <div key={call.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-25">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-800">{call.agentName}</span>
                        <Badge className={getSuccessRateBg(call.successRate)}>
                          {call.successRate > 0 ? `${call.successRate}%` : "Čeká..."}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{dateStr}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{call.scenario}</span>
                        {call.duration && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-neutral-300" />
                            <span>{call.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Desktop: table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left py-3 px-2 font-medium text-neutral-500">Datum</th>
                      <th className="text-left py-3 px-2 font-medium text-neutral-500">AI Agent</th>
                      <th className="text-left py-3 px-2 font-medium text-neutral-500">Scénář</th>
                      <th className="text-left py-3 px-2 font-medium text-neutral-500 hidden md:table-cell">Doba trvání</th>
                      <th className="text-right py-3 px-2 font-medium text-neutral-500">Úspěšnost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCalls.map((call) => {
                      const callDate = new Date(call.date);
                      const dateStr = `${callDate.getDate()}.${callDate.getMonth() + 1}. ${callDate.getHours()}:${String(callDate.getMinutes()).padStart(2, "0")}`;
                      return (
                        <tr key={call.id} className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors">
                          <td className="py-3 px-2 text-neutral-600">{dateStr}</td>
                          <td className="py-3 px-2 font-medium text-neutral-800">{call.agentName}</td>
                          <td className="py-3 px-2 text-neutral-600">{call.scenario}</td>
                          <td className="py-3 px-2 text-neutral-600 hidden md:table-cell">{call.duration}</td>
                          <td className="py-3 px-2 text-right">
                            <Badge className={getSuccessRateBg(call.successRate)}>
                              {call.successRate > 0 ? `${call.successRate}%` : "Čeká..."}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Action */}
      {!isOutOfCalls && (
        <Card className="border-primary-100 bg-gradient-to-r from-primary-50/50 to-white">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Připraveni na další trénink?
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                Začněte nový tréninkový hovor a zlepšete své prodejní
                dovednosti.
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
      )}
    </div>
  );
}

/* ============================================================
   MAIN PAGE — detects role and renders correct dashboard
   ============================================================ */
export default function DashboardPage() {
  const today = formatFullDate(new Date().toISOString());
  const { calls, isLoading } = useCallHistory({ limit: 50 });
  const [userName, setUserName] = useState("uživateli");
  const [userRole, setUserRole] = useState<"free" | "paid" | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    plan: "demo",
    tier: 0,
    minutesUsed: 0,
    minutesLimit: 10,
    agentsLimit: 1,
    status: "active",
  });

  useEffect(() => {
    // Fetch user name
    getUserSessionInfo().then((info) => {
      if (info) {
        setUserName(info.fullName?.split(" ")[0] || "uživateli");
      }
    });

    // Fetch subscription data — this determines free vs paid
    getAuthHeaders().then((headers) => {
      fetch("/api/subscription", { headers })
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setSubscription(data);
            // plan !== "demo" means paid (solo, team, etc.)
            setUserRole(data.plan !== "demo" ? "paid" : "free");
          } else {
            setUserRole("free");
          }
        })
        .catch(() => {
          setUserRole("free");
        });
    });
  }, []);

  const totalCalls = calls.length;
  const completedCalls = calls.filter((c) => c.successRate > 0);
  const totalMinutes = Math.round(
    calls.reduce((sum, c) => {
      const parts = c.duration.split(":");
      return sum + (parseInt(parts[0] || "0") * 60 + parseInt(parts[1] || "0"));
    }, 0) / 60
  );
  const avgSuccessRate =
    completedCalls.length > 0
      ? Math.round(
        completedCalls.reduce((sum, c) => sum + c.successRate, 0) /
        completedCalls.length
      )
      : 0;

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

  const isFree = userRole === "free" || subscription.plan === "demo";

  if (isFree) {
    return (
      <FreeDashboard
        userName={userName}
        today={today}
        calls={calls}
        isLoading={isLoading}
        subscription={subscription}
      />
    );
  }

  return (
    <PaidDashboard
      userName={userName}
      today={today}
      calls={calls}
      isLoading={isLoading}
      totalMinutes={totalMinutes}
      avgSuccessRate={avgSuccessRate}
      chartData={chartData}
      subscription={subscription}
    />
  );
}
