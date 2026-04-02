"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { getAuthHeaders } from "@/lib/auth";

export type CallPhase =
  | "idle"
  | "connecting"
  | "active"
  | "ending"
  | "processing"
  | "completed"
  | "error";

interface UseTrainingCallOptions {
  onCallStarted?: (callId: string) => void;
  onCallEnded?: (callId: string) => void;
  onError?: (error: string) => void;
  maxDurationSeconds?: number;
}

export interface ProcessingResult {
  overall_score: number;
  summary_good: string | null;
  summary_improve: string | null;
}

interface CallState {
  phase: CallPhase;
  callId: string | null;
  conversationId: string | null;
  duration: number;
  agentId: string | null;
  scenarioId: string | null;
  error: string | null;
  isMuted: boolean;
  processingResult: ProcessingResult | null;
}

export function useTrainingCall(options: UseTrainingCallOptions = {}) {
  const [state, setState] = useState<CallState>({
    phase: "idle",
    callId: null,
    conversationId: null,
    duration: 0,
    agentId: null,
    scenarioId: null,
    error: null,
    isMuted: false,
    processingResult: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Use refs to avoid stale closure in onDisconnect
  const callIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const conversation = useConversation({
    onConnect: () => {
      setState((prev) => ({ ...prev, phase: "active" }));
      startTimeRef.current = Date.now();

      // Start duration timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setState((prev) => ({ ...prev, duration: elapsed }));

        // Auto-disconnect if max duration is reached
        if (
          optionsRef.current.maxDurationSeconds &&
          elapsed >= optionsRef.current.maxDurationSeconds
        ) {
          conversation.endSession();
        }
      }, 1000);
    },
    onDisconnect: () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const finalDuration = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      setState((prev) => ({
        ...prev,
        phase: "processing",
        duration: finalDuration,
      }));

      // Use refs to get current values (not stale closure)
      const currentCallId = callIdRef.current;
      const currentConversationId = conversationIdRef.current;

      if (currentCallId) {
        // Step 1: Update call record with conversation_id and duration
        getAuthHeaders().then((headers) => {
          fetch(`/api/calls/${currentCallId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              status: "processing",
              duration_seconds: finalDuration,
              conversation_id: currentConversationId,
            }),
          })
            .then(() => {
              // Step 2: Trigger server-side processing
              return getAuthHeaders().then((processHeaders) =>
                fetch(`/api/calls/${currentCallId}/process`, {
                  method: "POST",
                  headers: processHeaders,
                })
              );
            })
            .then((res) => res.json())
            .then((result) => {
              console.log("Call processing result:", result);
              setState((prev) => ({
                ...prev,
                phase: "completed",
                processingResult: result?.overall_score != null
                  ? {
                      overall_score: result.overall_score,
                      summary_good: result.summary_good || null,
                      summary_improve: result.summary_improve || null,
                    }
                  : null,
              }));
              optionsRef.current.onCallEnded?.(currentCallId);
            })
            .catch((err) => {
              console.error("Failed to process call:", err);
              // Still mark as completed so the user isn't stuck
              setState((prev) => ({ ...prev, phase: "completed" }));
            });
        });
      } else {
        // No callId — still mark as completed so UI isn't stuck
        setState((prev) => ({ ...prev, phase: "completed" }));
      }
    },
    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setState((prev) => ({
        ...prev,
        phase: "error",
        error: typeof error === "string" ? error : "Chyba připojení k hovoru",
      }));
      optionsRef.current.onError?.(
        typeof error === "string" ? error : "Chyba připojení k hovoru"
      );
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCall = useCallback(
    async (agentId: string, scenarioId: string) => {
      try {
        setState((prev) => ({
          ...prev,
          phase: "connecting",
          agentId,
          scenarioId,
          error: null,
          duration: 0,
        }));

        // 1. Get signed URL from our API
        const headers = await getAuthHeaders();
        const response = await fetch("/api/calls", {
          method: "POST",
          headers,
          body: JSON.stringify({
            agent_id: agentId,
            scenario_id: scenarioId,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Nepodařilo se zahájit hovor");
        }

        const { call_id, signed_url } = await response.json();

        // Store in both state and ref
        callIdRef.current = call_id;
        setState((prev) => ({
          ...prev,
          callId: call_id,
        }));

        // 2. Start WebRTC conversation via ElevenLabs SDK
        const convId = await conversation.startSession({
          signedUrl: signed_url,
        });

        // Store conversation ID in both state and ref
        conversationIdRef.current = convId || null;
        setState((prev) => ({
          ...prev,
          conversationId: convId || null,
        }));

        // 3. Update call record with conversation_id
        const patchHeaders = await getAuthHeaders();
        await fetch(`/api/calls/${call_id}`, {
          method: "PATCH",
          headers: patchHeaders,
          body: JSON.stringify({
            status: "active",
            conversation_id: convId,
          }),
        });

        optionsRef.current.onCallStarted?.(call_id);
      } catch (error) {
        console.error("startCall error:", error);
        setState((prev) => ({
          ...prev,
          phase: "error",
          error:
            error instanceof Error
              ? error.message
              : "Nepodařilo se zahájit hovor",
        }));
      }
    },
    [conversation]
  );

  const endCall = useCallback(async () => {
    setState((prev) => ({ ...prev, phase: "ending" }));
    await conversation.endSession();
  }, [conversation]);

  const toggleMute = useCallback(() => {
    setState((prev) => {
      const newMuted = !prev.isMuted;
      conversation.setMicMuted(newMuted);
      return { ...prev, isMuted: newMuted };
    });
  }, [conversation]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    callIdRef.current = null;
    conversationIdRef.current = null;
    setState({
      phase: "idle",
      callId: null,
      conversationId: null,
      duration: 0,
      agentId: null,
      scenarioId: null,
      error: null,
      isMuted: false,
      processingResult: null,
    });
  }, []);

  return {
    ...state,
    isSpeaking: conversation.isSpeaking,
    startCall,
    endCall,
    toggleMute,
    reset,
  };
}
