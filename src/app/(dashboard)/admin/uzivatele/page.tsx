"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionInfo {
  id: string;
  plan: string;
  tier: number;
  status: string;
  calls_used: number;
  calls_limit: number;
  current_period_end: string | null;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  plan_role: string;
  created_at: string;
  subscriptions: SubscriptionInfo | null;
}

const roleBadge: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "warning" }
> = {
  demo: { label: "Demo", variant: "secondary" },
  solo: { label: "Solo", variant: "default" },
  team: { label: "Team", variant: "success" },
  admin: { label: "Admin", variant: "warning" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "právě teď";
  if (hours < 24) return `před ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `před ${days}d`;
  return new Date(dateStr).toLocaleDateString("cs-CZ");
}

export default function AdminUzivatelePage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({ limit: "100", offset: "0" });
        if (search) params.set("search", search);
        if (roleFilter !== "all") params.set("plan_role", roleFilter);

        const res = await fetch(`/api/admin/users?${params}`);
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
          <option value="demo">Demo</option>
          <option value="solo">Solo</option>
          <option value="team">Team</option>
          <option value="admin">Admin</option>
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
            <div className="hidden lg:grid lg:grid-cols-7 gap-3 px-5 py-3 border-b border-neutral-100 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
              <span className="col-span-2">Uživatel</span>
              <span>Role</span>
              <span className="text-center">Hovory</span>
              <span className="text-center">Plán</span>
              <span className="text-center">Stav</span>
              <span className="text-right">Registrace</span>
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
                    const role = roleBadge[user.plan_role] || {
                      label: user.plan_role,
                      variant: "secondary" as const,
                    };
                    const sub = user.subscriptions;
                    return (
                      <div
                        key={user.id}
                        className="grid grid-cols-1 lg:grid-cols-7 gap-1 lg:gap-3 px-5 py-3.5 hover:bg-neutral-50/50 transition-colors items-center"
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
                          </div>
                        </div>

                        {/* Role */}
                        <div className="hidden lg:block">
                          <Badge variant={role.variant}>{role.label}</Badge>
                        </div>

                        {/* Calls */}
                        <p className="hidden lg:block text-sm font-medium text-neutral-900 text-center">
                          {sub
                            ? `${sub.calls_used}/${sub.calls_limit}`
                            : "—"}
                        </p>

                        {/* Plan */}
                        <p className="hidden lg:block text-sm text-neutral-600 text-center capitalize">
                          {sub
                            ? `${sub.plan} ${sub.tier}`
                            : "Demo"}
                        </p>

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

                        {/* Mobile summary */}
                        <p className="lg:hidden text-xs text-neutral-500">
                          {role.label} ·{" "}
                          {sub
                            ? `${sub.plan} ${sub.tier} · ${sub.calls_used}/${sub.calls_limit} hovorů`
                            : "Demo účet"}
                        </p>
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
    </div>
  );
}
