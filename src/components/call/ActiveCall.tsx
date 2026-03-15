"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CallPhase, ProcessingResult } from "@/hooks/useTrainingCall";

interface ActiveCallProps {
  phase: CallPhase;
  duration: number;
  agentName: string;
  agentPersonality: string;
  agentInitials: string;
  isSpeaking: boolean;
  isMuted: boolean;
  error: string | null;
  processingResult?: ProcessingResult | null;
  onEndCall: () => void;
  onToggleMute: () => void;
  onReset: () => void;
  onViewResults: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function ActiveCall({
  phase,
  duration,
  agentName,
  agentPersonality,
  agentInitials,
  isSpeaking,
  isMuted,
  error,
  processingResult,
  onEndCall,
  onToggleMute,
  onReset,
  onViewResults,
}: ActiveCallProps) {
  const [pulseScale, setPulseScale] = useState(1);

  // Pulse animation when AI is speaking
  useEffect(() => {
    if (isSpeaking && phase === "active") {
      const interval = setInterval(() => {
        setPulseScale((prev) => (prev === 1 ? 1.1 : 1));
      }, 500);
      return () => clearInterval(interval);
    }
    setPulseScale(1);
  }, [isSpeaking, phase]);

  return (
    <div className="flex min-h-[50vh] sm:min-h-[60vh] flex-col items-center justify-center px-3 sm:px-4">
      <AnimatePresence mode="wait">
        {/* Connecting State */}
        {phase === "connecting" && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4 sm:gap-6 text-center"
          >
            <div className="relative">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-600">
                  {agentInitials}
                </span>
              </div>
              <div className="absolute -right-1 -bottom-1 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-amber-100">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-amber-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Připojování...
              </h2>
              <p className="mt-1 text-neutral-500">
                Navazuji spojení s {agentName}
              </p>
            </div>
          </motion.div>
        )}

        {/* Active Call State */}
        {phase === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-5 sm:gap-8 text-center"
          >
            {/* Avatar with speaking indicator */}
            <div className="relative">
              <motion.div
                animate={{ scale: pulseScale }}
                transition={{ duration: 0.3 }}
                className={`flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full ${
                  isSpeaking
                    ? "bg-primary-100 ring-4 ring-primary-300"
                    : "bg-neutral-100"
                }`}
              >
                <span className="text-3xl sm:text-4xl font-bold text-neutral-700">
                  {agentInitials}
                </span>
              </motion.div>

              {/* Speaking indicator */}
              {isSpeaking && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500"
                >
                  <Volume2 className="h-5 w-5 text-white" />
                </motion.div>
              )}
            </div>

            {/* Agent Info */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {agentName}
              </h2>
              <p className="text-neutral-500">{agentPersonality}</p>
            </div>

            {/* Duration */}
            <div className="font-mono text-3xl sm:text-4xl font-light tabular-nums text-neutral-900">
              {formatDuration(duration)}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              <span className="text-sm text-green-600">
                {isSpeaking ? "Klient mluví..." : "Hovor probíhá"}
              </span>
            </div>

            {/* Call Controls */}
            <div className="flex items-center gap-5 sm:gap-4">
              <button
                onClick={onToggleMute}
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  isMuted
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={onEndCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600 active:scale-95"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Klikněte na červené tlačítko pro ukončení hovoru
            </p>
          </motion.div>
        )}

        {/* Ending State */}
        {phase === "ending" && (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-neutral-400" />
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Ukončování hovoru...
              </h2>
              <p className="mt-1 text-neutral-500">Čas hovoru: {formatDuration(duration)}</p>
            </div>
          </motion.div>
        )}

        {/* Processing State */}
        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4 sm:gap-6 text-center"
          >
            <div className="relative">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-blue-50">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Analyzuji hovor...
              </h2>
              <p className="mt-1 max-w-sm text-neutral-500">
                ChatGPT vyhodnocuje váš výkon. Trvání hovoru:{" "}
                {formatDuration(duration)}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-left text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Hovor ukončen</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span>Zpracovávám přepis...</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span>Generuji zpětnou vazbu...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Completed State — inline results */}
        {phase === "completed" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4 sm:gap-6 text-center w-full max-w-md"
          >
            {/* Score circle or checkmark */}
            <div className={`flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full ${
              processingResult
                ? processingResult.overall_score >= 70
                  ? "bg-green-50"
                  : processingResult.overall_score >= 50
                    ? "bg-yellow-50"
                    : "bg-red-50"
                : "bg-green-50"
            }`}>
              {processingResult ? (
                <span className={`text-3xl sm:text-4xl font-bold ${
                  processingResult.overall_score >= 70
                    ? "text-green-600"
                    : processingResult.overall_score >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}>
                  {processingResult.overall_score}%
                </span>
              ) : (
                <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-green-500" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Hovor dokončen!
              </h2>
              <p className="mt-1 text-neutral-500">
                Délka hovoru: {formatDuration(duration)}
              </p>
            </div>

            {/* Inline summary — what was good */}
            {processingResult?.summary_good && (
              <div className="w-full rounded-xl bg-green-50 border border-green-100 p-4 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 shrink-0" />
                  <p className="text-sm text-green-800">{processingResult.summary_good}</p>
                </div>
              </div>
            )}

            {/* Inline summary — what to improve */}
            {processingResult?.summary_improve && (
              <div className="w-full rounded-xl bg-amber-50 border border-amber-100 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-800">{processingResult.summary_improve}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onReset}>
                Nový hovor
              </Button>
              <Button onClick={onViewResults}>Kompletní detail</Button>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4 sm:gap-6 text-center"
          >
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-12 w-12 sm:h-14 sm:w-14 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Chyba hovoru
              </h2>
              <p className="mt-1 max-w-sm text-neutral-500">
                {error || "Nepodařilo se navázat spojení. Zkuste to prosím znovu."}
              </p>
            </div>
            <Button onClick={onReset}>Zkusit znovu</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
