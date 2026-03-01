"use client";

import { motion } from "framer-motion";
import { Mic, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallInterfaceMockupProps {
  className?: string;
}

export function CallInterfaceMockup({ className }: CallInterfaceMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-sm",
        className
      )}
      style={{
        perspective: "1200px",
      }}
    >
      {/* Glow effect behind */}
      <div className="absolute -inset-6 rounded-3xl bg-primary-500/10 blur-2xl" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateY: -5 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Window bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[11px] text-white/30 font-mono">
            ELITE AI — Tréninkový hovor
          </span>
        </div>

        {/* Call content */}
        <div className="px-6 pt-8 pb-6 flex flex-col items-center">
          {/* Status badge */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-green-400 font-medium">
              Hovor probíhá
            </span>
          </div>

          {/* Agent avatar */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-4 ring-primary-500/20">
              <span className="text-2xl font-bold text-white">PS</span>
            </div>
          </motion.div>

          {/* Agent info */}
          <h3 className="text-white font-semibold text-lg">Petr Svoboda</h3>
          <p className="text-white/40 text-sm mt-0.5">Horký lead</p>

          {/* Timer */}
          <div className="mt-5 font-mono text-3xl font-light text-white/90 tabular-nums tracking-wider">
            02:34
          </div>

          {/* Waveform */}
          <div className="mt-5 flex items-end justify-center gap-[3px] h-8">
            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.5, 0.7].map(
              (height, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-primary-400/70"
                  animate={{
                    height: [`${height * 32}px`, `${height * 12}px`, `${height * 32}px`],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                />
              )
            )}
          </div>

          {/* Transcript preview */}
          <div className="mt-6 w-full space-y-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/5">
              <p className="text-[11px] text-white/30 mb-0.5">Petr Svoboda</p>
              <p className="text-sm text-white/70">
                Ano, zvažujeme prodej. Ale potřebujeme to do tří měsíců...
              </p>
            </div>
            <div className="bg-primary-500/10 rounded-lg px-3 py-2 border border-primary-500/10 ml-4">
              <p className="text-[11px] text-primary-400/60 mb-0.5">Vy</p>
              <p className="text-sm text-white/70">
                Rozumím, to je reálný termín. Mohu vám představit...
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/15 transition-colors cursor-default">
              <Mic className="w-5 h-5" />
            </div>
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 cursor-default">
              <PhoneOff className="w-6 h-6" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
