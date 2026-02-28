"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";

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
        fetch(`/api/calls/${currentCallId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "processing",
            duration_seconds: finalDuration,
            conversation_id: currentConversationId,
          }),
        })
          .then(() => {
            // Step 2: Trigger server-side processing
            // (fetches transcript from ElevenLabs, sends to ChatGPT, stores in Supabase)
            return fetch(`/api/calls/${currentCallId}/process`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
          })
          .then((res) => res.json())
          .then((result) => {
            console.log("Call processing result:", result);
            setState((prev) => ({ ...prev, phase: "completed" }));
            optionsRef.current.onCallEnded?.(currentCallId);
          })
          .catch((err) => {
            console.error("Failed to process call:", err);
            // Still mark as completed so the user isn't stuck
            setState((prev) => ({ ...prev, phase: "completed" }));
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
        const response = await fetch("/api/calls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        await fetch(`/api/calls/${call_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

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
