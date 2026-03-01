"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  HardDrive,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
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
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { systemMetrics } from "@/data/admin/platform-stats";
import { errorLog, apiUsageDaily } from "@/data/admin/system";

const severityConfig = {
  error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", variant: "secondary" as const, label: "Error" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", variant: "warning" as const, label: "Warning" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50", variant: "default" as const, label: "Info" },
};

const serviceColors: Record<string, string> = {
  elevenlabs: "bg-amber-100 text-amber-700",
  openai: "bg-blue-100 text-blue-700",
  supabase: "bg-green-100 text-green-700",
  vercel: "bg-neutral-100 text-neutral-700",
};

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return `${d.getDate()}.${d.getMonth() + 1}. ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">
          Systém & API
        </h1>
        <p className="text-neutral-500 mt-1">
          Monitorování služeb a spotřeba API
        </p>
      </motion.div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ElevenLabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-amber-50">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    ElevenLabs
                  </p>
                  <p className="text-xs text-neutral-500">Voice AI</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Kredit</span>
                    <span className="font-medium text-neutral-700">
                      {systemMetrics.elevenlabsCreditsUsed}%
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
                </div>
                <p className="text-xs text-neutral-400">
                  {systemMetrics.elevenlabsCalls.toLocaleString("cs-CZ")} API
                  volání tento měsíc
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* OpenAI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <Cpu className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    OpenAI
                  </p>
                  <p className="text-xs text-neutral-500">GPT-4o analýza</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500">Tokeny</span>
                  <span className="text-sm font-bold text-neutral-900">
                    {(systemMetrics.openaiTokens / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-500">Náklady</span>
                  <span className="text-sm font-bold text-neutral-900">
                    {systemMetrics.openaiCost.toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Supabase Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-green-50">
                  <HardDrive className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Supabase
                  </p>
                  <p className="text-xs text-neutral-500">Database & Storage</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Storage</span>
                    <span className="font-medium text-neutral-700">
                      {systemMetrics.storageUsedGB} / {systemMetrics.storageTotalGB} GB
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(systemMetrics.storageUsedGB / systemMetrics.storageTotalGB) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vercel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-neutral-100">
                  <Globe className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Vercel
                  </p>
                  <p className="text-xs text-neutral-500">Hosting</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-bold text-green-700">
                    {systemMetrics.uptime}%
                  </p>
                  <p className="text-[10px] text-green-600">uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* API Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>API volání za posledních 14 dní</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={apiUsageDaily}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#737373" }}
                    axisLine={{ stroke: "#e5e5e5" }}
                    tickLine={false}
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
                  />
                  <Legend
                    iconType="square"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Bar
                    dataKey="elevenlabs"
                    name="ElevenLabs"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="openai"
                    name="OpenAI"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-neutral-400" />
              <CardTitle>Poslední logy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errorLog.map((entry) => {
                const sev = severityConfig[entry.severity];
                const SevIcon = sev.icon;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${sev.bg} transition-colors`}
                  >
                    <SevIcon className={`w-4 h-4 mt-0.5 shrink-0 ${sev.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${serviceColors[entry.service]}`}
                        >
                          {entry.service}
                        </span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700 mt-1">
                        {entry.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
