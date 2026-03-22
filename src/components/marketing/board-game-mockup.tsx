"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardGameMockupProps {
  className?: string;
}

const mockNodes = [
  // Row 1 (left to right)
  { num: 1, done: true, color: "bg-blue-500" },
  { num: 2, done: true, color: "bg-blue-500" },
  { num: 3, done: true, color: "bg-blue-500" },
  { num: 4, done: true, color: "bg-blue-400" },
  { num: 5, done: true, color: "bg-blue-400" },
  // Row 2 (right to left)
  { num: 10, done: false, current: true, color: "bg-emerald-400" },
  { num: 9, done: false, color: "bg-emerald-300" },
  { num: 8, done: true, color: "bg-emerald-500" },
  { num: 7, done: true, color: "bg-blue-500" },
  { num: 6, done: true, color: "bg-blue-500" },
  // Row 3 (left to right)
  { num: 11, done: false, color: "bg-emerald-300" },
  { num: 12, done: false, color: "bg-emerald-300" },
  { num: 13, done: false, color: "bg-emerald-300" },
  { num: 14, done: false, color: "bg-yellow-300" },
  { num: 15, done: false, color: "bg-yellow-300" },
];

const categories = [
  { label: "Prodej", color: "bg-blue-500", range: "1-15" },
  { label: "Nájem", color: "bg-emerald-500", range: "16-28" },
  { label: "Finance", color: "bg-yellow-500", range: "29-38" },
  { label: "Právní vady", color: "bg-purple-500", range: "39-51" },
  { label: "Katastr", color: "bg-indigo-500", range: "52-56" },
  { label: "Technické", color: "bg-orange-500", range: "57-67" },
  { label: "Smlouvy", color: "bg-cyan-500", range: "68-74" },
  { label: "Speciální typy", color: "bg-rose-500", range: "75-85" },
  { label: "Marketing", color: "bg-pink-500", range: "86-92" },
  { label: "Etika", color: "bg-teal-500", range: "93-100" },
];

export function BoardGameMockup({ className }: BoardGameMockupProps) {
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

  const rows = [
    mockNodes.slice(0, 5),
    mockNodes.slice(5, 10),
    mockNodes.slice(10, 15),
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-800">Učební cesta</p>
            <p className="text-[11px] text-neutral-400">100 lekcí z realitní praxe</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-400">Úroveň</p>
          <p className="text-xs font-bold text-primary-500">Pokročilý makléř</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-neutral-400">Začátečník</span>
          <span className="text-[10px] font-bold text-primary-500">Elitní makléř</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-1000 ease-out"
            style={{ width: isVisible ? "9%" : "0%" }}
          />
        </div>
        <p className="text-right text-[10px] text-neutral-400 mt-0.5">9 / 100 splněno</p>
      </div>

      {/* Board game grid */}
      <div className="px-5 py-4">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx}>
            <div className="grid grid-cols-5 gap-2">
              {row.map((node, nodeIdx) => (
                <div
                  key={node.num}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 py-2.5 transition-all duration-500",
                    node.done
                      ? "border-transparent bg-gradient-to-b from-white to-neutral-50 shadow-sm"
                      : node.current
                        ? "border-primary-300 bg-primary-50/50 shadow-md ring-2 ring-primary-200/50"
                        : "border-neutral-200 bg-neutral-50/50 opacity-60"
                  )}
                  style={{
                    transitionDelay: isVisible ? `${(rowIdx * 5 + nodeIdx) * 60}ms` : "0ms",
                    opacity: isVisible ? (node.done ? 1 : node.current ? 1 : 0.5) : 0,
                  }}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold",
                      node.done
                        ? `${node.color} text-white`
                        : node.current
                          ? "bg-primary-500 text-white animate-pulse"
                          : "bg-neutral-200 text-neutral-400"
                    )}
                  >
                    {node.done ? <Check className="w-3.5 h-3.5" /> : node.current ? node.num : <Lock className="w-3 h-3" />}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 font-medium">
                    {node.done ? "100%" : node.current ? "Aktivní" : ""}
                  </span>
                </div>
              ))}
            </div>
            {/* Connector between rows */}
            {rowIdx < rows.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-3 bg-neutral-200 rounded-full" />
              </div>
            )}
          </div>
        ))}
        <div className="text-center mt-2">
          <span className="text-[10px] text-neutral-300">... dalších 85 lekcí</span>
        </div>
      </div>

      {/* Category legend */}
      <div className="px-5 pb-4">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">10 kategorií</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span key={cat.label} className="inline-flex items-center gap-1 text-[10px] text-neutral-500">
              <span className={`w-2 h-2 rounded-full ${cat.color}`} />
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
