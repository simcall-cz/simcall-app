"use client";

import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Phone,
  Activity,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  teamMembers,
  teamSummary,
  teamLeaderboard,
} from "@/data/dashboard/team-data";

const statCards = [
  {
    label: "Počet makléřů",
    value: teamSummary.totalMembers,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Průměrná úspěšnost týmu",
    value: `${teamSummary.avgSuccessRate}%`,
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Hovorů tento měsíc",
    value: teamSummary.totalCallsThisMonth,
    icon: Phone,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Aktivní dnes",
    value: teamSummary.activeToday,
    icon: Activity,
    color: "bg-amber-50 text-amber-600",
  },
];

const recentActivities = [
  {
    initials: "RF",
    color: "bg-blue-500",
    text: "Roman Filip dokončil hovor - Skeptický klient (85%)",
    time: "před 10 min",
  },
  {
    initials: "TM",
    color: "bg-pink-500",
    text: "Tereza Marková dokončila lekci - Práce s námitkami",
    time: "před 25 min",
  },
  {
    initials: "JD",
    color: "bg-indigo-500",
    text: "Jan Dvořák zahájil trénink - Cold calling",
    time: "před 1 h",
  },
  {
    initials: "PN",
    color: "bg-emerald-500",
    text: "Petra Nová dosáhla achievementu - Týdenní série",
    time: "před 2 h",
  },
  {
    initials: "MK",
    color: "bg-orange-500",
    text: "Michal Kratochvíl dokončil hovor - Horký lead (72%)",
    time: "před 3 h",
  },
];

function getBarColor(rate: number): string {
  if (rate > 70) return "#22c55e";
  if (rate >= 50) return "#eab308";
  return "#ef4444";
}

const medalColors = ["text-yellow-500", "text-neutral-400", "text-amber-700"];
const medalLabels = ["🥇", "🥈", "🥉"];

export default function ManagerOverviewPage() {
  const chartData = teamMembers.map((m) => ({
    name: m.name.split(" ")[0],
    fullName: m.name,
    successRate: m.successRate,
  }));

  const alertMembers = teamMembers.filter(
    (m) => m.trend === "down" || new Date(m.lastActive) < new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
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

      {/* Chart + Top Performers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Výkon týmu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, "Úspěšnost"]}
                      labelFormatter={(label: any, payload: any) => {
                        if (payload && payload.length > 0) {
                          return (payload[0].payload as { fullName: string }).fullName;
                        }
                        return label;
                      }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                    />
                    <Bar dataKey="successRate" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.successRate)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-500" />
                  Nad 70%
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500" />
                  50-70%
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-500" />
                  Pod 50%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top výkon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamLeaderboard.slice(0, 3).map((entry, index) => {
                  const member = teamMembers.find(
                    (m) => m.id === entry.memberId
                  );
                  return (
                    <div
                      key={entry.memberId}
                      className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <span className="text-2xl">{medalLabels[index]}</span>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-neutral-400"
                            : "bg-amber-700"
                        }`}
                      >
                        {member?.avatarInitials || "??"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 text-sm truncate">
                          {entry.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {member?.callsThisMonth || 0} hovorů tento měsíc
                        </p>
                      </div>
                      <Badge variant="success">
                        {entry.score}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Team Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Poslední aktivita týmu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${activity.color}`}
                    >
                      {activity.initials}
                    </div>
                    <p className="flex-1 text-sm text-neutral-700 min-w-0">
                      {activity.text}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="h-full border-amber-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <CardTitle>Vyžadují pozornost</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {alertMembers.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Všichni členové týmu jsou aktivní.
                </p>
              ) : (
                <div className="space-y-3">
                  {alertMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-amber-50"
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 text-xs font-semibold shrink-0">
                        {member.avatarInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-neutral-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-amber-600">
                          {member.trend === "down"
                            ? "Klesající trend"
                            : "Neaktivní přes 2 dny"}
                        </p>
                      </div>
                      <Badge variant="warning">
                        {member.successRate}%
                      </Badge>
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
