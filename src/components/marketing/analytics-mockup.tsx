"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Target, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsMockupProps {
  className?: string;
  compact?: boolean;
}

export function AnalyticsMockup({ className, compact }: AnalyticsMockupProps) {
  const score = 78;
  const circumference = 2 * Math.PI * 42;
  const scoreOffset = circumference * (1 - score / 100);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {/* Window bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
        <span className="ml-3 text-[11px] text-neutral-400 font-mono">
          Analýza hovoru
        </span>
      </div>

      <div className={cn("p-5", compact ? "sm:p-5" : "sm:p-6")}>
        {/* Top row: Score + Meta */}
        <div className="flex items-start gap-5">
          {/* Score circle */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                stroke="#f5f5f5" strokeWidth="7" fill="none"
              />
              <circle
                cx="50" cy="50" r="42"
                stroke="#EF4444" strokeWidth="7" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={scoreOffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-neutral-800">{score}%</span>
              <span className="text-[9px] text-neutral-400">skóre</span>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-neutral-800 text-sm">Petr Svoboda — Horký lead</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
              <span>4:32</span>
              <span>3/4 cílů</span>
            </div>

            {/* Mini strengths */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs">
                <Check className="w-3 h-3 text-green-500 shrink-0" />
                <span className="text-neutral-600">Profesionální úvod a představení</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Check className="w-3 h-3 text-green-500 shrink-0" />
                <span className="text-neutral-600">Dobrá práce s námitkami</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Target className="w-3 h-3 text-red-400 shrink-0" />
                <span className="text-neutral-600">Silnější closing a uzavření</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filler words */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Výplňová slova
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["ehm (3x)", "vlastně (5x)", "jakoby (2x)", "prostě (4x)"].map((w) => (
              <span
                key={w}
                className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 px-2 py-0.5 text-[11px] font-medium border border-yellow-100"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Transcript preview */}
        {!compact && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3 h-3 text-primary-400" />
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Přepis hovoru
              </p>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex gap-2">
                <span className="font-medium text-primary-500 shrink-0">Vy:</span>
                <span className="text-neutral-500">Dobrý den, tady Jan Novák z Reality Plus...</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-neutral-700 shrink-0">AI:</span>
                <span className="text-neutral-500">Ano, zvažujeme prodej. Ale potřebujeme...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
