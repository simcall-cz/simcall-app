"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface Payment {
  id: string;
  user_id: string | null;
  user_email: string;
  user_name: string | null;
  plan: string;
  tier: number;
  amount: number;
  method: "stripe" | "invoice";
  status: "pending" | "completed" | "failed";
  stripe_session_id: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

const planLabel: Record<string, string> = { solo: "Solo", team: "Team" };
const methodLabel: Record<string, string> = { stripe: "Karta", invoice: "Faktura" };

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  completed: { label: "Zaplaceno", variant: "success" },
  pending: { label: "Čeká na platbu", variant: "warning" },
  failed: { label: "Neúspěšné", variant: "secondary" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("cs-CZ") + " Kč";
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() &&
         d.getMonth() === now.getMonth() &&
         d.getFullYear() === now.getFullYear();
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  
  // Get Monday of the current week
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 = Sunday, we want 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);

  return d >= monday;
}

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() &&
         d.getFullYear() === now.getFullYear();
}

export default function AdminPlatbyPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPayments() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/payments", { headers });
      if (!res.ok) throw new Error("Nepodařilo se načíst platby");
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchPayments(); }, []);

  const completedPayments = useMemo(() => payments.filter((p) => p.status === "completed"), [payments]);

  const dailyRevenue = useMemo(
    () => completedPayments.filter((p) => isToday(p.created_at)).reduce((s, p) => s + p.amount, 0),
    [completedPayments]
  );
  const weeklyRevenue = useMemo(
    () => completedPayments.filter((p) => isThisWeek(p.created_at)).reduce((s, p) => s + p.amount, 0),
    [completedPayments]
  );
  const monthlyRevenue = useMemo(
    () => completedPayments.filter((p) => isThisMonth(p.created_at)).reduce((s, p) => s + p.amount, 0),
    [completedPayments]
  );
  const pendingCount = useMemo(() => payments.filter((p) => p.status === "pending").length, [payments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-2 text-red-500">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-900">Přehled plateb</h1>
        <p className="text-neutral-500 mt-1">
          Všechny přijaté platby, Stripe i fakturační
        </p>
      </motion.div>

      {/* Revenue widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Dnes</p>
                  <p className="text-xl font-bold text-neutral-900">{formatCurrency(dailyRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Tento týden</p>
                  <p className="text-xl font-bold text-neutral-900">{formatCurrency(weeklyRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Tento měsíc</p>
                  <p className="text-xl font-bold text-neutral-900">{formatCurrency(monthlyRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Čekající</p>
                  <p className="text-xl font-bold text-neutral-900">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payments table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle>Všechny platby ({payments.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-25">
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Datum</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Zákazník</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Plán</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">Metoda</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Částka</th>
                    <th className="text-center py-3 px-4 font-medium text-neutral-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const cfg = statusConfig[payment.status] || statusConfig.pending;
                    return (
                      <tr key={payment.id} className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors">
                        <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-neutral-800">
                              {payment.user_name || "Bez jména"}
                            </span>
                            <span className="block text-xs text-neutral-400">{payment.user_email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {planLabel[payment.plan] || payment.plan} · Tier {payment.tier}
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <Badge variant={payment.method === "stripe" ? "default" : "secondary"}>
                            {payment.method === "stripe" ? (
                              <><CreditCard className="w-3 h-3 mr-1" />{methodLabel[payment.method]}</>
                            ) : (
                              <><Receipt className="w-3 h-3 mr-1" />{methodLabel[payment.method]}</>
                            )}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-neutral-800">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-neutral-400">—</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {payments.length === 0 && (
                <div className="text-center py-12 text-neutral-400">
                  <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Zatím žádné platby</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
