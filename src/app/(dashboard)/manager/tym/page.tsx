"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
  Phone,
  Clock,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { teamMembers, teamSummary } from "@/data/dashboard/team-data";
import type { TeamMember } from "@/types/dashboard";

type SortKey = "name" | "successRate" | "callsThisMonth";
type TrendFilter = "all" | "up" | "down" | "stable";

function getTrendIcon(trend: TeamMember["trend"]) {
  switch (trend) {
    case "up":
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    case "stable":
      return <Minus className="w-4 h-4 text-neutral-400" />;
  }
}

function getTrendColor(trend: TeamMember["trend"]): string {
  switch (trend) {
    case "up":
      return "bg-green-500";
    case "down":
      return "bg-red-500";
    case "stable":
      return "bg-neutral-400";
  }
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

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "name", label: "Jméno" },
  { key: "successRate", label: "Úspěšnost" },
  { key: "callsThisMonth", label: "Počet hovorů" },
];

const trendOptions: { key: TrendFilter; label: string }[] = [
  { key: "all", label: "Všechny trendy" },
  { key: "up", label: "Rostoucí" },
  { key: "down", label: "Klesající" },
  { key: "stable", label: "Stabilní" },
];

export default function TeamPage() {
  const [sortBy, setSortBy] = useState<SortKey>("successRate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = [...teamMembers];

    if (trendFilter !== "all") {
      result = result.filter((m) => m.trend === trendFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name, "cs");
          break;
        case "successRate":
          comparison = a.successRate - b.successRate;
          break;
        case "callsThisMonth":
          comparison = a.callsThisMonth - b.callsThisMonth;
          break;
      }
      return sortDir === "desc" ? -comparison : comparison;
    });

    return result;
  }, [sortBy, sortDir, trendFilter]);

  const activeThisWeek = teamMembers.filter((m) => {
    const lastActive = new Date(m.lastActive);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastActive > weekAgo;
  }).length;

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
    setShowSortDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Můj tým</h1>
        <p className="text-neutral-500 mt-1">
          Spravujte a sledujte výkon jednotlivých makléřů
        </p>
      </motion.div>

      {/* Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Celkem členů</p>
                  <p className="text-lg font-bold text-neutral-900">
                    {teamSummary.totalMembers}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
              <div>
                <p className="text-xs text-neutral-500">Průměrná úspěšnost</p>
                <p className="text-lg font-bold text-neutral-900">
                  {teamSummary.avgSuccessRate}%
                </p>
              </div>
              <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
              <div>
                <p className="text-xs text-neutral-500">Aktivní tento týden</p>
                <p className="text-lg font-bold text-neutral-900">
                  {activeThisWeek}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sort & Filter Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowFilterDropdown(false);
            }}
            className="flex items-center gap-2"
          >
            <span className="text-neutral-500">Řadit:</span>
            <span className="font-medium">
              {sortOptions.find((o) => o.key === sortBy)?.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </Button>
          {showSortDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSort(option.key)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                    sortBy === option.key
                      ? "text-red-600 font-medium"
                      : "text-neutral-700"
                  }`}
                >
                  {option.label}
                  {sortBy === option.key && (
                    <span className="ml-2 text-xs text-neutral-400">
                      {sortDir === "desc" ? "↓" : "↑"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowFilterDropdown(!showFilterDropdown);
              setShowSortDropdown(false);
            }}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500">Filtr:</span>
            <span className="font-medium">
              {trendOptions.find((o) => o.key === trendFilter)?.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </Button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1">
              {trendOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setTrendFilter(option.key);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                    trendFilter === option.key
                      ? "text-red-600 font-medium"
                      : "text-neutral-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {trendFilter !== "all" && (
          <button
            onClick={() => setTrendFilter("all")}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors underline"
          >
            Zrušit filtr
          </button>
        )}

        <span className="text-sm text-neutral-400 ml-auto">
          {filteredAndSorted.length}{" "}
          {filteredAndSorted.length === 1 ? "makléř" : "makléřů"}
        </span>
      </motion.div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSorted.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
          >
            <Card className="hover:shadow-card-hover transition-shadow h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${getTrendColor(
                      member.trend
                    )}`}
                  >
                    {member.avatarInitials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-sm text-neutral-500">{member.role}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 space-y-3">
                  {/* Success Rate */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Úspěšnost</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold text-neutral-900">
                        {member.successRate}%
                      </span>
                      {getTrendIcon(member.trend)}
                    </div>
                  </div>

                  {/* Calls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      Hovorů tento měsíc
                    </span>
                    <span className="font-medium text-neutral-700">
                      {member.callsThisMonth}
                    </span>
                  </div>

                  {/* Last Active */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Poslední aktivita
                    </span>
                    <span className="text-sm text-neutral-500">
                      {formatLastActive(member.lastActive)}
                    </span>
                  </div>
                </div>

                {/* Detail Button */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <Link href={`/manager/makler/${member.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Zobrazit detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500">
            Žádní makléři neodpovídají zvoleným filtrům.
          </p>
          <button
            onClick={() => setTrendFilter("all")}
            className="mt-2 text-sm text-red-500 hover:text-red-600 underline"
          >
            Zobrazit všechny
          </button>
        </div>
      )}
    </div>
  );
}
