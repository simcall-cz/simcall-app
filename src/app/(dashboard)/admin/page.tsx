"use client";

import { motion } from "framer-motion";
import {
  Users,
  Phone,
  DollarSign,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Cpu,
  HardDrive,
  Zap,
} from "lucide-react";
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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  platformStats,
  dailyCallsData,
  monthlyRevenueData,
  recentRegistrations,
  systemMetrics,
} from "@/data/admin/platform-stats";

const statCards = [
  {
    label: "Celkem uživatelů",
    value: platformStats.totalUsers.toLocaleString("cs-CZ"),
    trend: platformStats.totalUsersTrend,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Celkem hovorů",
    value: platformStats.totalCalls.toLocaleString("cs-CZ"),
    trend: platformStats.totalCallsTrend,
    icon: Phone,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "MRR",
    value: `${(platformStats.mrr / 1000).toFixed(1)}k Kč`,
    trend: platformStats.mrrTrend,
    icon: DollarSign,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Aktivní předplatitelé",
    value: platformStats.activeSubscribers.toString(),
    trend: platformStats.activeSubscribersTrend,
    icon: CreditCard,
    color: "bg-amber-50 text-amber-600",
  },
];

const planBadgeColor: Record<string, "default" | "secondary" | "success" | "warning"> = {
  starter: "secondary",
  professional: "default",
  enterprise: "success",
  trial: "warning",
};

const planLabel: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
  trial: "Trial",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}.${d.getMonth() + 1}. ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function AdminOverviewPage() {
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
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600">
                        +{stat.trend}%
                      </span>
                      <span className="text-xs text-neutral-400">
                        vs minulý měsíc
                      </span>
                    </div>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Calls Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hovorů za posledních 30 dní</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyCallsData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="callsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                      formatter={(value: any) => [
                        `${value} hovorů`,
                        "Počet",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#callsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tržby za posledních 6 měsíců</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenueData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      width={45}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                      formatter={(value: any) => [
                        `${value.toLocaleString("cs-CZ")} Kč`,
                        "Tržby",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Recent Registrations + System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Poslední registrace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-semibold shrink-0">
                      {reg.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {reg.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {reg.company}
                      </p>
                    </div>
                    <Badge variant={planBadgeColor[reg.plan]}>
                      {planLabel[reg.plan]}
                    </Badge>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDate(reg.date)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Systémové metriky</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {/* ElevenLabs */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        ElevenLabs
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {systemMetrics.elevenlabsCreditsUsed}% použito
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${systemMetrics.elevenlabsCreditsUsed}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    {systemMetrics.elevenlabsCalls.toLocaleString("cs-CZ")} API
                    volání
                  </p>
                </div>

                {/* OpenAI */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        OpenAI
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {systemMetrics.openaiCost.toLocaleString("cs-CZ")} Kč
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {(systemMetrics.openaiTokens / 1000000).toFixed(1)}M tokenů
                    tento měsíc
                  </p>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        Storage
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {systemMetrics.storageUsedGB} /{" "}
                      {systemMetrics.storageTotalGB} GB
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(systemMetrics.storageUsedGB / systemMetrics.storageTotalGB) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Uptime */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Uptime
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {systemMetrics.uptime}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
