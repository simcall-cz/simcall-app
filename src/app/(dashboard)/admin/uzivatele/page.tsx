"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Eye,
  X,
  Phone,
  CreditCard,
  Calendar,
  Users,
  Mail,
  User as UserIcon,
  Shield,
  Clock,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface SubscriptionInfo {
  id: string;
  plan: string;
  tier: number;
  status: string;
  seconds_used: number;
  minutes_limit: number;
  current_period_end: string | null;
  billing_method?: string;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  subscriptions: SubscriptionInfo | null;
  manager_email: string | null;
}

interface UserCallSummary {
  total: number;
  thisMonth: number;
  avgScore: number;
}

interface UserPayment {
  id: string;
  plan: string;
  tier: number;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

const roleBadge: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "warning" }
> = {
  free: { label: "Free", variant: "secondary" },
  demo: { label: "Demo", variant: "secondary" },
  solo: { label: "Solo", variant: "default" },
  team: { label: "Člen týmu", variant: "success" },
  team_manager: { label: "Team Manager", variant: "warning" },
  admin: { label: "Admin", variant: "warning" },
};

const allRoles = ["free", "solo", "team", "team_manager"] as const;

// Combined role+tier options for the admin dropdown
const PLAN_OPTIONS = [
  { value: "free", label: "Free (10 minut)" },
  { value: "solo:1", label: "Solo · 100 minut" },
  { value: "solo:2", label: "Solo · 250 minut" },
  { value: "solo:3", label: "Solo · 500 minut" },
  { value: "solo:4", label: "Solo · 1 000 minut" },
  { value: "team:1", label: "Team · 500 minut" },
  { value: "team:2", label: "Team · 1 000 minut" },
  { value: "team:3", label: "Team · 2 500 minut" },
  { value: "team:4", label: "Team · 5 000 minut" },
  { value: "team_manager:1", label: "Team Manager · 500 minut" },
  { value: "team_manager:2", label: "Team Manager · 1 000 minut" },
  { value: "team_manager:3", label: "Team Manager · 2 500 minut" },
  { value: "team_manager:4", label: "Team Manager · 5 000 minut" },
];

function getUserPlanValue(user: AdminUser): string {
  const sub = user.subscriptions;
  if (!sub || user.role === "free") return "free";
  if (["solo", "team", "team_manager"].includes(user.role) && sub.tier) {
    return `${user.role}:${sub.tier}`;
  }
  return user.role === "solo" ? "solo:1" : user.role === "team" ? "team:1" : user.role === "team_manager" ? "team_manager:1" : "free";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "právě teď";
  if (hours < 24) return `před ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `před ${days}d`;
  return new Date(dateStr).toLocaleDateString("cs-CZ");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function UserDetailModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [calls, setCalls] = useState<UserCallSummary | null>(null);
  const [payments, setPayments] = useState<UserPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const headers = await getAuthHeaders();

        // Fetch user's calls
        const callsRes = await fetch(`/api/admin/calls?user_id=${user.id}&limit=500`, { headers });
        const callsData = await callsRes.json();
        const allCalls = callsData.calls || [];

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthCalls = allCalls.filter((c: { date: string }) => new Date(c.date) >= startOfMonth);
        const scores = allCalls
          .map((c: { success_rate?: number }) => c.success_rate || 0)
          .filter((s: number) => s > 0);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

        setCalls({ total: allCalls.length, thisMonth: thisMonthCalls.length, avgScore });

        // Fetch user's payments
        try {
          const paymentsRes = await fetch("/api/admin/payments", { headers });
          const paymentsData = await paymentsRes.json();
          const userPayments = (paymentsData.payments || []).filter(
            (p: { user_id: string | null; user_email: string }) => p.user_id === user.id || p.user_email === user.email
          );
          setPayments(userPayments);
        } catch {
          // payments table may not exist
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [user]);

  const sub = user.subscriptions;
  const role = roleBadge[user.role] || { label: user.role, variant: "secondary" as const };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl sm:my-8 sm:mx-4 max-h-[92vh] border border-neutral-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-sm font-bold text-primary-600">
              {user.full_name
                ? user.full_name.split(" ").map((n) => n[0]).join("")
                : user.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{user.full_name || "Bez jména"}</h2>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-neutral-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] text-neutral-500 uppercase">Role</span>
              </div>
              <Badge variant={role.variant}>{role.label}</Badge>
            </div>
            <div className="bg-neutral-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] text-neutral-500 uppercase">Registrace</span>
              </div>
              <p className="text-sm font-semibold text-neutral-800">{formatDate(user.created_at)}</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] text-neutral-500 uppercase">Minuty</span>
              </div>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              ) : (
                <p className="text-sm font-semibold text-neutral-800">
                  {calls?.total || 0} celkem · {calls?.thisMonth || 0} tento měs.
                </p>
              )}
            </div>
            {!isLoading && calls && calls.avgScore > 0 && (
              <div className="bg-neutral-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[10px] text-neutral-500 uppercase">Prům. skóre</span>
                </div>
                <p className={`text-sm font-semibold ${calls.avgScore >= 70 ? "text-green-600" : calls.avgScore >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                  {calls.avgScore}%
                </p>
              </div>
            )}
            {user.role === "team" && user.manager_email && (
              <div className="bg-blue-50 rounded-xl p-3 col-span-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] text-blue-500 uppercase">Manažer</span>
                </div>
                <p className="text-sm font-semibold text-blue-700">{user.manager_email}</p>
              </div>
            )}
          </div>

          {/* Subscription */}
          {sub && (
            <div className="border border-neutral-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-400" />
                Předplatné
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-neutral-500">Plán:</span>
                  <span className="ml-2 font-medium text-neutral-800 capitalize">{sub.plan} · Tier {sub.tier}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Stav:</span>
                  <Badge className="ml-2" variant={sub.status === "active" ? "success" : "secondary"}>
                    {sub.status === "active" ? "Aktivní" : sub.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-neutral-500">Platba:</span>
                  <Badge className="ml-2" variant={sub.billing_method === "invoice" ? "secondary" : "default"}>
                    {sub.billing_method === "invoice" ? "Faktura" : "Karta"}
                  </Badge>
                </div>
                <div>
                  <span className="text-neutral-500">Minuty:</span>
                  <span className="ml-2 font-medium text-neutral-800">{Math.floor((sub.seconds_used || 0) / 60)}/{sub.minutes_limit} minut</span>
                </div>
                {sub.current_period_end && (
                  <div>
                    <span className="text-neutral-500">Platí do:</span>
                    <span className="ml-2 font-medium text-neutral-800">
                      {new Date(sub.current_period_end).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments */}
          <div className="border border-neutral-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-400" />
              Historie plateb
            </h3>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            ) : payments.length === 0 ? (
              <p className="text-sm text-neutral-400">Žádné platby</p>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b border-neutral-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={p.method === "stripe" ? "default" : "secondary"} className="text-[10px]">
                        {p.method === "stripe" ? "Karta" : "Faktura"}
                      </Badge>
                      <span className="text-neutral-700 capitalize">{p.plan} T{p.tier}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={p.status === "completed" ? "success" : p.status === "pending" ? "warning" : "secondary"} className="text-[10px]">
                        {p.status === "completed" ? "Zaplaceno" : p.status === "pending" ? "Čeká" : p.status}
                      </Badge>
                      <span className="font-medium text-neutral-800">{p.amount.toLocaleString("cs-CZ")} Kč</span>
                      <span className="text-xs text-neutral-400">{new Date(p.created_at).toLocaleDateString("cs-CZ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-neutral-100">
          <Button variant="outline" size="sm" onClick={onClose}>Zavřít</Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUzivatelePage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ limit: "100", offset: "0" });
      if (search) params.set("search", search);
      if (roleFilter !== "all") params.set("role", roleFilter);

      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/users?${params}`, { headers });
      if (!res.ok) throw new Error("Nepodařilo se načíst uživatele");
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba při načítání");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [search, roleFilter]);

  if (error && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-neutral-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary-500 hover:underline"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Uživatelé</h1>
        <p className="text-neutral-500 mt-1">
          {total} registrovaných uživatelů
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Hledat jméno nebo email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">Všechny role</option>
          <option value="free">Free</option>
          <option value="solo">Solo</option>
          <option value="team">Team</option>
          <option value="team_manager">Team Manager</option>
        </select>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card>
          <CardContent className="p-0">
            {/* Header Row */}
            <div className="hidden lg:grid lg:grid-cols-8 gap-3 px-5 py-3 border-b border-neutral-100 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
              <span className="col-span-2">Uživatel</span>
              <span>Role</span>
              <span className="text-center">Minuty</span>
              <span className="text-center">Plán</span>
              <span className="text-center">Stav</span>
              <span className="text-right">Registrace</span>
              <span className="text-right">Akce</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
              </div>
            ) : (
              <>
                {/* Rows */}
                <div className="divide-y divide-neutral-50">
                  {users.map((user) => {
                    const role = roleBadge[user.role] || {
                      label: user.role,
                      variant: "secondary" as const,
                    };
                    const sub = user.subscriptions;
                    return (
                      <div
                        key={user.id}
                        className="grid grid-cols-1 lg:grid-cols-8 gap-1 lg:gap-3 px-5 py-3.5 hover:bg-neutral-50/50 transition-colors items-center"
                      >
                        {/* User */}
                        <div className="col-span-2 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-600 shrink-0">
                            {user.full_name
                              ? user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : user.email?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {user.full_name || "Bez jména"}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">
                              {user.email}
                            </p>
                            {user.role === "team" && user.manager_email && (
                              <p className="text-[10px] text-blue-500 truncate">
                                ← {user.manager_email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Role + Tier — combined dropdown */}
                        <div className="hidden lg:block">
                          <select
                            value={getUserPlanValue(user)}
                            onChange={async (e) => {
                              const val = e.target.value;
                              const [newRole, tierStr] = val.includes(":") ? val.split(":") : [val, undefined];
                              const tier = tierStr ? parseInt(tierStr) : undefined;
                              setChangingRoleId(user.id);
                              try {
                                const authHeaders = await getAuthHeaders();
                                const res = await fetch("/api/admin/users", {
                                  method: "PATCH",
                                  headers: { ...authHeaders, "Content-Type": "application/json" },
                                  body: JSON.stringify({ userId: user.id, planRole: newRole, tier }),
                                });
                                if (!res.ok) throw new Error();
                                await fetchUsers();
                              } catch {
                                await fetchUsers();
                              } finally {
                                setChangingRoleId(null);
                              }
                            }}
                            disabled={changingRoleId === user.id}
                            className="text-xs font-medium rounded-md border border-neutral-200 bg-white px-2 py-1 text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
                          >
                            {PLAN_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Calls */}
                        <p className="hidden lg:block text-sm font-medium text-neutral-900 text-center">
                          {sub
                            ? `${Math.floor((sub.seconds_used || 0) / 60)}/${sub.minutes_limit}`
                            : "—"}
                        </p>

                        {/* Plan */}
                        <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center gap-1">
                          <p className="text-sm text-neutral-600 capitalize">
                            {sub ? `${sub.plan} ${sub.tier}` : "Demo"}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="hidden lg:flex lg:justify-center">
                          {sub ? (
                            <Badge
                              variant={
                                sub.status === "active"
                                  ? "success"
                                  : sub.status === "past_due"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {sub.status === "active"
                                ? "Aktivní"
                                : sub.status === "past_due"
                                ? "Po splatnosti"
                                : sub.status === "cancelled"
                                ? "Zrušeno"
                                : sub.status}
                            </Badge>
                          ) : (
                            <span className="text-xs text-neutral-400">—</span>
                          )}
                        </div>

                        {/* Registered */}
                        <p className="hidden lg:block text-xs text-neutral-400 text-right">
                          {timeAgo(user.created_at)}
                        </p>

                        {/* Eye icon */}
                        <div className="hidden lg:flex lg:justify-end">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                            title="Detail uživatele"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Mobile summary */}
                        <div className="lg:hidden flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-neutral-500">
                              {role.label} ·{" "}
                              {sub
                                ? `${sub.plan} ${sub.tier} · ${Math.floor((sub.seconds_used || 0) / 60)}/${sub.minutes_limit} minut`
                                : "Demo účet"}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {users.length === 0 && (
                  <div className="text-center py-12 text-sm text-neutral-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    Žádní uživatelé neodpovídají filtrům
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
