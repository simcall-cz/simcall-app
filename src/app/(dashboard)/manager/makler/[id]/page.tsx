"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Minus,
  Phone,
  Clock,
  Trophy,
  BookOpen,
  Save,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { teamMembers } from "@/data/dashboard/team-data";
import { callHistory } from "@/data/dashboard/call-history";

// Generate mock daily data around a base success rate
function generateMockDailyData(
  baseRate: number
): { date: string; successRate: number }[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2026, 1, i + 1);
    return {
      date: date.toISOString().split("T")[0],
      successRate: Math.max(
        20,
        Math.min(100, baseRate + Math.floor(Math.random() * 30 - 15))
      ),
    };
  });
}

function getTrendIcon(trend: "up" | "down" | "stable") {
  switch (trend) {
    case "up":
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    case "stable":
      return <Minus className="w-4 h-4 text-neutral-400" />;
  }
}

function getTrendLabel(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up":
      return "Rostoucí";
    case "down":
      return "Klesající";
    case "stable":
      return "Stabilní";
  }
}

function getTrendBadgeVariant(
  trend: "up" | "down" | "stable"
): "success" | "warning" | "secondary" {
  switch (trend) {
    case "up":
      return "success";
    case "down":
      return "warning";
    case "stable":
      return "secondary";
  }
}

function getAvatarColor(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up":
      return "bg-green-500";
    case "down":
      return "bg-red-500";
    case "stable":
      return "bg-neutral-400";
  }
}

function getScoreBadgeVariant(
  score: number
): "success" | "warning" | "default" {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "default";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function formatLastActive(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Právě aktivní";
  if (diffHours < 24) return `Před ${diffHours} h`;
  if (diffDays === 1) return "Včera";
  return `Před ${diffDays} dny`;
}

const scenarioPerformance = [
  { scenario: "Horké leady", score: 0 },
  { scenario: "Studené kontakty", score: 0 },
  { scenario: "Vyjednávání", score: 0 },
  { scenario: "Konkurenční situace", score: 0 },
];

function generateScenarioData(baseRate: number) {
  return scenarioPerformance.map((s) => ({
    ...s,
    score: Math.max(
      50,
      Math.min(90, baseRate + Math.floor(Math.random() * 20 - 10))
    ),
  }));
}

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const member = teamMembers.find((m) => m.id === resolvedParams.id);

  const dailyData = useMemo(
    () => (member ? generateMockDailyData(member.successRate) : []),
    [member]
  );

  const scenarioData = useMemo(
    () => (member ? generateScenarioData(member.successRate) : []),
    [member]
  );

  // Get recent calls - map some callHistory entries to this agent
  const recentCalls = useMemo(() => {
    if (!member) return [];
    return callHistory.slice(0, 5).map((call, idx) => ({
      id: call.id,
      date: call.date,
      scenario: call.scenario,
      duration: call.duration,
      score: call.successRate,
    }));
  }, [member]);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">
          Makléř nenalezen
        </h1>
        <p className="text-neutral-500">
          Člen týmu s tímto ID neexistuje.
        </p>
        <Link href="/manager/tym">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na tým
          </Button>
        </Link>
      </div>
    );
  }

  const completedLessons = Math.floor(member.successRate / 10);
  const totalLessons = 9;
  const achievementsCount = member.successRate > 70 ? 5 : member.successRate > 50 ? 3 : 1;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href="/manager/tym"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na tým
        </Link>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Large Avatar */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 ${getAvatarColor(
                  member.trend
                )}`}
              >
                {member.avatarInitials}
              </div>

              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {member.name}
                </h1>
                <p className="text-neutral-500 mt-0.5">{member.role}</p>
              </div>
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100">
              <div>
                <p className="text-xs text-neutral-500">Úspěšnost</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-neutral-900">
                    {member.successRate}%
                  </span>
                  <Badge variant={getScoreBadgeVariant(member.successRate)}>
                    {member.successRate >= 75
                      ? "Výborný"
                      : member.successRate >= 50
                      ? "Průměr"
                      : "Pod průměr"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Hovorů tento měsíc</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {member.callsThisMonth}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Trend</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {getTrendIcon(member.trend)}
                  <Badge variant={getTrendBadgeVariant(member.trend)}>
                    {getTrendLabel(member.trend)}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Poslední aktivita</p>
                <p className="text-sm font-medium text-neutral-700 mt-1.5">
                  {formatLastActive(member.lastActive)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Vývoj výkonu</CardTitle>
            <CardDescription>
              Úspěšnost za posledních 30 dní
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#737373" }}
                    axisLine={{ stroke: "#e5e5e5" }}
                    tickLine={false}
                    tickFormatter={(value: string) => {
                      const d = new Date(value);
                      return `${d.getDate()}.${d.getMonth() + 1}.`;
                    }}
                    interval={4}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#737373" }}
                    axisLine={{ stroke: "#e5e5e5" }}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "Úspěšnost"]}
                    labelFormatter={(label: any) => {
                      const d = new Date(label);
                      return d.toLocaleDateString("cs-CZ");
                    }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e5e5",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="successRate"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: "#EF4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance by Scenario + Training Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Výkon podle scénářů</CardTitle>
              <CardDescription>
                Úspěšnost v různých typech hovorů
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scenarioData}
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
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="scenario"
                      tick={{ fontSize: 12, fill: "#525252" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      width={130}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, "Úspěšnost"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {scenarioData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.score >= 75
                              ? "#22c55e"
                              : entry.score >= 60
                              ? "#eab308"
                              : "#ef4444"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Training Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Postup v tréninku</CardTitle>
              <CardDescription>
                Dokončené lekce a dosažené úspěchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Lessons Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        Dokončené lekce
                      </span>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">
                      {completedLessons} z {totalLessons}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(completedLessons / totalLessons) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-400 mt-1.5">
                    {Math.round((completedLessons / totalLessons) * 100)}%
                    dokončeno
                  </p>
                </div>

                {/* Achievements */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        Dosažené úspěchy
                      </span>
                    </div>
                    <Badge variant="secondary">{achievementsCount}</Badge>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: achievementsCount }).map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"
                      >
                        <Trophy className="w-5 h-5 text-amber-500" />
                      </div>
                    ))}
                    {Array.from({
                      length: Math.max(0, 5 - achievementsCount),
                    }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center"
                      >
                        <Trophy className="w-5 h-5 text-neutral-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Calls Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Poslední hovory</CardTitle>
            <CardDescription>
              Posledních 5 hovorů tohoto makléře
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider pb-3 pr-4">
                      Datum
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider pb-3 pr-4">
                      Scénář
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider pb-3 pr-4">
                      Délka
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider pb-3">
                      Skóre
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((call) => (
                    <tr
                      key={call.id}
                      className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-3 pr-4 text-sm text-neutral-600">
                        {formatDate(call.date)}
                      </td>
                      <td className="py-3 pr-4 text-sm text-neutral-900 font-medium">
                        {call.scenario}
                      </td>
                      <td className="py-3 pr-4 text-sm text-neutral-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {call.duration}
                      </td>
                      <td className="py-3">
                        <Badge variant={getScoreBadgeVariant(call.score)}>
                          {call.score}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Manager Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Poznámky manažera</CardTitle>
            <CardDescription>
              Vaše soukromé poznámky k tomuto makléři
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              disabled
              placeholder="Zde můžete přidat poznámky k tomuto makléři..."
              className="w-full h-32 p-3 text-sm border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-700 placeholder:text-neutral-400 resize-none focus:outline-none"
            />
            <div className="mt-3 flex justify-end">
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Uložit poznámky
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
