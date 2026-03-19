"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Target,
  Lightbulb,
  GraduationCap,
  Search,
  Lock,
  Loader2,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/auth";
import {
  lessons,
  LESSON_CATEGORIES,
  DIFFICULTY_CONFIG,
  type Lesson,
} from "@/data/lessons";
import Link from "next/link";

export default function LekcePage() {
  const [isFree, setIsFree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAuthHeaders().then((headers) => {
      fetch("/api/subscription", { headers })
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.error || data.plan === "demo") {
            setIsFree(true);
          }
        })
        .catch(() => setIsFree(true))
        .finally(() => setLoading(false));
    });
  }, []);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (selectedCategory !== "all" && lesson.category !== selectedCategory)
        return false;
      if (
        selectedDifficulty !== "all" &&
        lesson.difficulty !== selectedDifficulty
      )
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          lesson.title.toLowerCase().includes(q) ||
          lesson.situation.toLowerCase().includes(q) ||
          lesson.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const toggleLesson = (num: number) => {
    setExpandedLesson((prev) => (prev === num ? null : num));
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Free users — paywall
  if (isFree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 mb-6">
          <Lock className="h-10 w-10 text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Lekce jsou dostupné v placeném plánu
        </h1>
        <p className="text-neutral-500 max-w-md mb-6">
          Získejte přístup k {lessons.length} lekcím z realitní praxe, které vám
          pomohou připravit se na tréninkové hovory.
        </p>
        <Link href="/dashboard/balicek">
          <Button size="lg" className="gap-2">
            <GraduationCap className="h-5 w-5" />
            Zobrazit plány
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <BookOpen className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Lekce
            </h1>
            <p className="text-sm text-neutral-500">
              {lessons.length} lekcí z realitní praxe
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Hledat lekci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Category + Difficulty filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="all">Všechny kategorie</option>
              {LESSON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty chips */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "Všechny" },
                { key: "beginner", label: "Začátečník" },
                { key: "intermediate", label: "Středně pokročilý" },
                { key: "advanced", label: "Pokročilý" },
              ] as const
            ).map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDifficulty(d.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  selectedDifficulty === d.key
                    ? d.key === "all"
                      ? "border-primary-500 bg-primary-50 text-primary-600"
                      : d.key === "beginner"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : d.key === "intermediate"
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-red-500 bg-red-50 text-red-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-neutral-500">
        Zobrazeno {filteredLessons.length} z {lessons.length} lekcí
      </div>

      {/* Lesson rows */}
      <div className="space-y-2">
        {filteredLessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.number;
          const diffConf = DIFFICULTY_CONFIG[lesson.difficulty];

          return (
            <div key={lesson.number}>
              {/* Row header — clickable */}
              <button
                onClick={() => toggleLesson(lesson.number)}
                className={cn(
                  "w-full flex items-center gap-3 sm:gap-4 rounded-lg border px-4 py-3 sm:py-3.5 text-left transition-all hover:shadow-sm",
                  isExpanded
                    ? "border-primary-200 bg-primary-50/30 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                {/* Number */}
                <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
                  {lesson.number}
                </span>

                {/* Title + Category */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate text-sm sm:text-base">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lesson.category}
                  </p>
                </div>

                {/* Difficulty badge */}
                <span
                  className={cn(
                    "hidden sm:inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                    diffConf.color
                  )}
                >
                  {diffConf.label}
                </span>

                {/* Chevron */}
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                )}
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-0 sm:ml-12 mt-1 rounded-lg border border-neutral-100 bg-white p-4 sm:p-5 space-y-4">
                      {/* Mobile difficulty badge */}
                      <div className="sm:hidden">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            diffConf.color
                          )}
                        >
                          {diffConf.label}
                        </span>
                      </div>

                      {/* Situation */}
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          Situace
                        </h4>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {lesson.situation}
                        </p>
                      </div>

                      {/* Knowledge */}
                      {lesson.knowledge.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Co potřebujete vědět
                          </h4>
                          <ul className="space-y-1.5">
                            {lesson.knowledge.map((k, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-neutral-600"
                              >
                                <GraduationCap className="h-4 w-4 shrink-0 mt-0.5 text-primary-400" />
                                <span>{k}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Goal */}
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          Cíl
                        </h4>
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                          <p className="text-sm text-neutral-700">
                            {lesson.goal}
                          </p>
                        </div>
                      </div>

                      {/* Tips */}
                      {lesson.tips.length > 0 && (
                        <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-3">
                          <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5" />
                            Tipy
                          </h4>
                          <ul className="space-y-1.5">
                            {lesson.tips.map((tip, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-amber-700"
                              >
                                <span className="shrink-0 mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-dashed border-neutral-200">
          <BookOpen className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">
            Žádné lekce nenalezeny pro zvolené filtry.
          </p>
        </div>
      )}
    </div>
  );
}
