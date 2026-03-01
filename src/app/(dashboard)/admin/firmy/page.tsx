"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { companies } from "@/data/admin/companies";

const statusConfig = {
  active: { label: "Aktivní", variant: "success" as const, dot: "bg-green-500" },
  trial: { label: "Trial", variant: "warning" as const, dot: "bg-amber-500" },
  inactive: { label: "Neaktivní", variant: "secondary" as const, dot: "bg-neutral-400" },
};

const planLabel: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
  trial: "Trial",
};

export default function AdminFirmyPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || c.plan === planFilter;
    return matchSearch && matchPlan;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Správa firem</h1>
        <p className="text-neutral-500 mt-1">
          {companies.length} registrovaných firem
        </p>
      </motion.div>

      {/* Search + Filter */}
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
            placeholder="Hledat firmu nebo kontakt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
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

      {/* Companies List */}
      <div className="space-y-3">
        {filtered.map((company, index) => {
          const status = statusConfig[company.status];
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <Link href={`/admin/firmy/${company.id}`}>
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer group">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-neutral-500" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-neutral-900 text-sm">
                            {company.name}
                          </h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">
                          {company.contactName} · {company.contactEmail}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-bold text-neutral-900">
                            {company.agentCount}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            makléřů
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-neutral-900">
                            {company.totalCalls}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            hovorů
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-neutral-900">
                            {company.avgScore}%
                          </p>
                          <p className="text-[10px] text-neutral-400">skóre</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-neutral-900">
                            {company.mrr > 0
                              ? `${(company.mrr / 1000).toFixed(1)}k`
                              : "—"}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            MRR Kč
                          </p>
                        </div>
                      </div>

                      {/* Plan + Arrow */}
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="secondary" className="hidden sm:inline-flex">
                          {planLabel[company.plan]}
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
