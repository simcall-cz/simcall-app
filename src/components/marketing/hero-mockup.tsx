"use client";

import { useEffect, useState } from "react";
import { Check, Phone } from "lucide-react";

export function HeroMockup() {
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setShowResults(true), 1800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!showResults) return;
    let count = 0;
    const interval = setInterval(() => {
      count += 3;
      setScore(Math.min(count, 87));
      if (count >= 87) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [showResults]);

  return (
    <div className="relative mx-auto w-full max-w-[420px] select-none">
      {/* Glow */}
      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-primary-500/20 to-primary-300/10 blur-3xl pointer-events-none" />

      {/* Browser window */}
      <div className="relative rounded-2xl bg-neutral-900 border border-white/[0.08] shadow-[0_32px_72px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800/70 border-b border-white/[0.05]">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-neutral-700/60 rounded-md px-3 py-1 flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
              app.simcall.cz
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="p-4 space-y-3">
          {/* App header row */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Trénink hovorů</p>
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-[11px] px-2.5 py-1 rounded-full border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              Hovor probíhá
            </div>
          </div>

          {/* Active call card */}
          <div className="bg-neutral-800/60 rounded-xl p-4 border border-white/[0.05]">
            <div className="flex items-center gap-3 mb-4">
              {/* Pulsing avatar */}
              <div className="relative shrink-0">
                <div
                  className="absolute inset-0 rounded-full bg-primary-500/25 animate-ping"
                  style={{ animationDuration: "2.2s" }}
                />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                  PS
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Petr Svoboda</p>
                <p className="text-[11px] text-neutral-400">Horký lead · 02:34</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Phone className="w-3.5 h-3.5 text-white rotate-[135deg]" />
                </div>
              </div>
            </div>

            {/* Animated waveform */}
            <div className="flex items-end justify-center gap-[3px] h-7 mb-4">
              {[0.3, 0.6, 0.9, 0.4, 0.8, 0.5, 0.7, 1.0, 0.5, 0.6, 0.3, 0.8, 0.6, 0.4, 0.9, 0.5, 0.7].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-primary-400/70 animate-pulse"
                  style={{
                    height: `${h * 28}px`,
                    animationDelay: `${i * 0.07}s`,
                    animationDuration: `${0.7 + h * 0.5}s`,
                  }}
                />
              ))}
            </div>

            {/* Transcript lines */}
            <div className="space-y-1.5">
              <div className="bg-white/[0.06] rounded-lg px-3 py-2">
                <p className="text-[11px] text-neutral-300">
                  <span className="text-neutral-500 font-medium">Agent: </span>
                  Ano, zvažujeme prodej. Ale potřebujeme to do tří měsíců...
                </p>
              </div>
              <div className="bg-primary-500/10 rounded-lg px-3 py-2 ml-3">
                <p className="text-[11px] text-neutral-300">
                  <span className="text-primary-400 font-medium">Vy: </span>
                  Rozumím, to je reálný termín. Mohu vám představit...
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Hovory dnes", value: "8" },
              { label: "Prům. skóre", value: "82%" },
              { label: "Série dnů", value: "5 🔥" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-lg p-2.5 text-center border border-white/[0.04]"
              >
                <p className="text-sm font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating analytics card */}
      <div
        className={`absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-2xl shadow-neutral-300/50 border border-neutral-100/80 p-3 w-48 transition-all duration-700 ease-out ${
          showResults
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Poslední analýza
        </p>
        <div className="flex items-center gap-2.5">
          {/* Score ring */}
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="17" fill="none" stroke="#f5f5f5" strokeWidth="3.5" />
              <circle
                cx="22"
                cy="22"
                r="17"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 17}`}
                strokeDashoffset={`${2 * Math.PI * 17 * (1 - score / 100)}`}
                className="transition-all duration-200"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-neutral-800">
              {score}%
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-800">Výborně!</p>
            <p className="text-[10px] text-neutral-500">3/4 cíle splněny</p>
          </div>
        </div>
        <div className="mt-2.5 space-y-1">
          {["Profesionální úvod", "Práce s námitkami"].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-[10px] text-neutral-600">
              <Check className="w-3 h-3 text-green-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge top-left */}
      <div
        className={`absolute -top-3 -left-3 bg-white rounded-xl shadow-lg border border-neutral-100 px-3 py-1.5 flex items-center gap-2 transition-all duration-500 delay-300 ${
          showResults
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center">
          <span className="text-[11px]">🇨🇿</span>
        </div>
        <span className="text-[11px] font-medium text-neutral-700">
          #1 v Česku
        </span>
      </div>
    </div>
  );
}
