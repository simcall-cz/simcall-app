"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Play, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { lessons } from "@/data/dashboard/lessons";
import type { Lesson } from "@/types/dashboard";

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

const difficultyConfig: Record<
  Lesson["difficulty"],
  { label: string; badgeClass: string }
> = {
  beginner: {
    label: "Začátečník",
    badgeClass: "bg-green-50 text-green-700",
  },
  intermediate: {
    label: "Pokročilý",
    badgeClass: "bg-yellow-50 text-yellow-700",
  },
  advanced: {
    label: "Expert",
    badgeClass: "bg-red-50 text-red-700",
  },
};

const filterTabs: { key: DifficultyFilter; label: string }[] = [
  { key: "all", label: "Všechny" },
  { key: "beginner", label: "Začátečník" },
  { key: "intermediate", label: "Pokročilý" },
  { key: "advanced", label: "Expert" },
];

function LessonCard({ lesson }: { lesson: Lesson }) {
  const config = difficultyConfig[lesson.difficulty];

  const getStatus = () => {
    if (lesson.completed) {
      return { label: "Dokončeno", variant: "success" as const };
    }
    if (lesson.progress > 0) {
      return { label: "Rozpracováno", variant: "warning" as const };
    }
    return null;
  };

  const status = getStatus();

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col flex-1">
        {/* Top row: difficulty + status */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={config.badgeClass}>{config.label}</Badge>
          {status && <Badge variant={status.variant}>{status.label}</Badge>}
        </div>

        {/* Category */}
        <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1">
          {lesson.category}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-neutral-900 mb-2">{lesson.title}</h3>

        {/* Description */}
        <p className="text-sm text-neutral-500 leading-relaxed flex-1">
          {lesson.description}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 mt-4 text-xs text-neutral-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{lesson.duration}</span>
        </div>

        {/* Progress bar (if started but not completed) */}
        {!lesson.completed && lesson.progress > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Průběh</span>
              <span>{lesson.progress}%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${lesson.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-4">
          {lesson.completed ? (
            <Button variant="outline" size="sm" className="w-full">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              Zopakovat
            </Button>
          ) : lesson.progress > 0 ? (
            <Button size="sm" className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Pokračovat
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Zahájit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LekcePage() {
  const [filter, setFilter] = useState<DifficultyFilter>("all");

  const filteredLessons =
    filter === "all"
      ? lessons
      : lessons.filter((l) => l.difficulty === filter);

  const completedCount = lessons.filter((l) => l.completed).length;
  const inProgressCount = lessons.filter(
    (l) => !l.completed && l.progress > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Tréninkové lekce
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {completedCount} dokončených &middot; {inProgressCount}{" "}
            rozpracovaných &middot; {lessons.length} celkem
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === tab.key
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-16 text-neutral-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            Žádné lekce v této kategorii.
          </p>
        </div>
      )}
    </div>
  );
}
