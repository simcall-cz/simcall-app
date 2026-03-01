"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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
import {
  planRevenueBreakdown,
  churnData,
  invoices,
  financialSummary,
} from "@/data/admin/financial";

const invoiceStatusConfig = {
  paid: { label: "Zaplaceno", variant: "success" as const },
  pending: { label: "Čeká", variant: "warning" as const },
  overdue: { label: "Po splatnosti", variant: "secondary" as const },
};

export default function FinancniPrehledPage() {
  const totalPieRevenue = planRevenueBreakdown.reduce(
    (s, p) => s + p.revenue,
    0
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">
          Finanční přehled
        </h1>
        <p className="text-neutral-500 mt-1">Tržby, předplatné a fakturace</p>
      </motion.div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "MRR",
            value: `${(financialSummary.mrr / 1000).toFixed(1)}k Kč`,
            icon: DollarSign,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "ARR",
            value: `${(financialSummary.arr / 1000000).toFixed(1)}M Kč`,
            icon: TrendingUp,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Prům. na uživatele",
            value: `${financialSummary.avgRevenuePerUser.toLocaleString("cs-CZ")} Kč`,
            icon: CreditCard,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Neuhrazeno",
            value: `${(financialSummary.totalOutstanding / 1000).toFixed(1)}k Kč`,
            icon: AlertCircle,
            color: "bg-amber-50 text-amber-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
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

      {/* Charts: Pie + Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan - Pie Chart */}
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
              <div className="h-72 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planRevenueBreakdown}
                      dataKey="revenue"
                      nameKey="plan"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {planRevenueBreakdown.map((entry) => (
                        <Cell key={entry.plan} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${Number(value).toLocaleString("cs-CZ")} Kč`,
                        "Tržby",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {planRevenueBreakdown.map((entry) => (
                  <div key={entry.plan} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-neutral-600">
                      {entry.plan} ({entry.subscribers}) —{" "}
                      {Math.round((entry.revenue / totalPieRevenue) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Churn Rate - Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Churn rate (měsíční)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={churnData}
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
                      domain={[0, 8]}
                      tick={{ fontSize: 12, fill: "#737373" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                      width={40}
                    />
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, "Churn"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-green-50">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">
                  Churn klesá — z 5.2% na 2.8% za posledních 6 měsíců
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-neutral-400" />
              <CardTitle>Poslední faktury</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-3 px-3 py-2 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
              <span className="col-span-2">Firma</span>
              <span>Období</span>
              <span className="text-right">Částka</span>
              <span className="text-right">Stav</span>
            </div>
            <div className="space-y-1">
              {invoices.map((inv) => {
                const invStatus = invoiceStatusConfig[inv.status];
                return (
                  <div
                    key={inv.id}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 px-3 py-3 rounded-lg hover:bg-neutral-50 transition-colors items-center"
                  >
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-neutral-900">
                        {inv.companyName}
                      </p>
                    </div>
                    <p className="hidden sm:block text-sm text-neutral-600">
                      {inv.period}
                    </p>
                    <p className="hidden sm:block text-sm font-bold text-neutral-900 text-right">
                      {inv.amount.toLocaleString("cs-CZ")} Kč
                    </p>
                    <div className="flex sm:justify-end">
                      <Badge variant={invStatus.variant}>
                        {invStatus.label}
                      </Badge>
                    </div>
                    {/* Mobile */}
                    <p className="sm:hidden text-xs text-neutral-500">
                      {inv.period} · {inv.amount.toLocaleString("cs-CZ")} Kč
                    </p>
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
