"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminUsers } from "@/data/admin/users";

const roleBadge: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
  "makléř": { label: "Makléř", variant: "secondary" },
  "manažer": { label: "Manažer", variant: "default" },
  admin: { label: "Admin", variant: "success" },
};

const planLabel: Record<string, string> = {
  starter: "Starter",
  professional: "Pro",
  enterprise: "Enterprise",
  trial: "Trial",
};

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
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

export default function AdminUzivatelePage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  const filtered = adminUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    return matchSearch && matchRole && matchPlan;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Uživatelé</h1>
        <p className="text-neutral-500 mt-1">
          {adminUsers.length} registrovaných uživatelů
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
            placeholder="Hledat jméno, email nebo firmu..."
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
          <option value="makléř">Makléř</option>
          <option value="manažer">Manažer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">Všechny plány</option>
          <option value="starter">Starter</option>
          <option value="professional">Professional</option>
          <option value="enterprise">Enterprise</option>
          <option value="trial">Trial</option>
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
              <span className="col-span-2">Firma</span>
              <span>Role</span>
              <span className="text-center">Hovory</span>
              <span className="text-center">Skóre</span>
              <span className="text-right">Aktivita</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-neutral-50">
              {filtered.map((user) => {
                const role = roleBadge[user.role];
                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-1 lg:grid-cols-8 gap-1 lg:gap-3 px-5 py-3.5 hover:bg-neutral-50/50 transition-colors items-center"
                  >
                    {/* User */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-600 shrink-0">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="col-span-2 hidden lg:block">
                      <p className="text-sm text-neutral-700 truncate">
                        {user.company}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {planLabel[user.plan]}
                      </p>
                    </div>

                    {/* Role */}
                    <div className="hidden lg:block">
                      <Badge variant={role.variant}>{role.label}</Badge>
                    </div>

                    {/* Calls */}
                    <p className="hidden lg:block text-sm font-medium text-neutral-900 text-center">
                      {user.callsTotal}
                    </p>

                    {/* Score */}
                    <p className={`hidden lg:block text-sm font-bold text-center ${getScoreColor(user.avgScore)}`}>
                      {user.avgScore}%
                    </p>

                    {/* Last Active */}
                    <p className="hidden lg:block text-xs text-neutral-400 text-right">
                      {timeAgo(user.lastActive)}
                    </p>

                    {/* Mobile summary */}
                    <p className="lg:hidden text-xs text-neutral-500">
                      {user.company} · {role.label} · {user.callsTotal} hovorů · {user.avgScore}%
                    </p>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-neutral-400">
                <Filter className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                Žádní uživatelé neodpovídají filtrům
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
