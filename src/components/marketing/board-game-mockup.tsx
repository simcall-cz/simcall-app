"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Check, Lock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardGameMockupProps {
  className?: string;
}

interface NodeState {
  num: number;
  color: string;
  status: "locked" | "unlocking" | "done" | "current";
}

const initialNodes: NodeState[] = [
  { num: 1, color: "bg-blue-500", status: "locked" },
  { num: 2, color: "bg-blue-500", status: "locked" },
  { num: 3, color: "bg-blue-500", status: "locked" },
  { num: 4, color: "bg-blue-400", status: "locked" },
  { num: 5, color: "bg-blue-400", status: "locked" },
  { num: 6, color: "bg-blue-500", status: "locked" },
  { num: 7, color: "bg-blue-500", status: "locked" },
  { num: 8, color: "bg-emerald-500", status: "locked" },
  { num: 9, color: "bg-emerald-400", status: "locked" },
  { num: 10, color: "bg-emerald-400", status: "locked" },
  { num: 11, color: "bg-emerald-300", status: "locked" },
  { num: 12, color: "bg-emerald-300", status: "locked" },
  { num: 13, color: "bg-emerald-300", status: "locked" },
  { num: 14, color: "bg-yellow-300", status: "locked" },
  { num: 15, color: "bg-yellow-300", status: "locked" },
];

const categories = [
  { label: "Prodej", color: "bg-blue-500" },
  { label: "Nájem", color: "bg-emerald-500" },
  { label: "Finance", color: "bg-yellow-500" },
  { label: "Právní vady", color: "bg-purple-500" },
  { label: "Katastr", color: "bg-indigo-500" },
  { label: "Technické", color: "bg-orange-500" },
  { label: "Smlouvy", color: "bg-cyan-500" },
  { label: "Speciální typy", color: "bg-rose-500" },
  { label: "Marketing", color: "bg-pink-500" },
  { label: "Etika a klienti", color: "bg-teal-500" },
];

const UNLOCK_COUNT = 9;
const UNLOCK_DELAY = 350;

export function BoardGameMockup({ className }: BoardGameMockupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [nodes, setNodes] = useState<NodeState[]>(initialNodes);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const animatingRef = useRef(false);

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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unlockNext = useCallback((step: number) => {
    if (step > UNLOCK_COUNT) return;

    setNodes((prev) => {
      const next = [...prev];
      // Complete previous node
      if (step > 1) {
        next[step - 2] = { ...next[step - 2], status: "done" };
      }
      // Current node is unlocking (or becomes current if it's the last)
      if (step <= UNLOCK_COUNT) {
        if (step === UNLOCK_COUNT) {
          next[step - 1] = { ...next[step - 1], status: "current" };
        } else {
          next[step - 1] = { ...next[step - 1], status: "unlocking" };
        }
      }
      return next;
    });

    setUnlockedCount(step === UNLOCK_COUNT ? step - 1 : step);

    if (step < UNLOCK_COUNT) {
      setTimeout(() => {
        setNodes((prev) => {
          const next = [...prev];
          next[step - 1] = { ...next[step - 1], status: "done" };
          return next;
        });
        setTimeout(() => unlockNext(step + 1), UNLOCK_DELAY * 0.4);
      }, UNLOCK_DELAY);
    }
  }, []);

  useEffect(() => {
    if (isVisible && !animatingRef.current) {
      animatingRef.current = true;
      setTimeout(() => unlockNext(1), 600);
    }
  }, [isVisible, unlockNext]);

  // Layout: row 1 = nodes 0-4, row 2 = nodes 5-9 (reversed), row 3 = nodes 10-14
  const rows = [
    nodes.slice(0, 5),
    [...nodes.slice(5, 10)].reverse(),
    nodes.slice(10, 15),
  ];

  const progressPct = Math.min(unlockedCount, UNLOCK_COUNT - 1);

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
            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-right text-[10px] text-neutral-400 mt-0.5 transition-all">
          {progressPct} / 100 splněno
        </p>
      </div>

      {/* Board game grid */}
      <div className="px-5 py-4">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx}>
            <div className="grid grid-cols-5 gap-2">
              {row.map((node) => (
                <div
                  key={node.num}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 py-2.5 transition-all duration-500 ease-out",
                    node.status === "done"
                      ? "border-transparent bg-gradient-to-b from-white to-neutral-50 shadow-sm scale-100"
                      : node.status === "unlocking"
                        ? "border-primary-300 bg-primary-50/50 shadow-lg ring-2 ring-primary-200 scale-110"
                        : node.status === "current"
                          ? "border-primary-300 bg-primary-50/50 shadow-md ring-2 ring-primary-200/50 scale-100"
                          : "border-neutral-200 bg-neutral-50/50 opacity-50 scale-95"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500",
                      node.status === "done"
                        ? `${node.color} text-white`
                        : node.status === "unlocking"
                          ? "bg-primary-500 text-white scale-125"
                          : node.status === "current"
                            ? "bg-primary-500 text-white animate-pulse"
                            : "bg-neutral-200 text-neutral-400"
                    )}
                  >
                    {node.status === "done" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : node.status === "unlocking" ? (
                      <span className="animate-ping absolute w-7 h-7 rounded-full bg-primary-400 opacity-30" />
                    ) : node.status === "current" ? (
                      node.num
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {node.status === "unlocking" && (
                      <Check className="w-3.5 h-3.5 relative z-10" />
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 font-medium h-3">
                    {node.status === "done" ? "100%" : node.status === "current" ? "Aktivní" : node.status === "unlocking" ? "80%" : ""}
                  </span>
                </div>
              ))}
            </div>
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
