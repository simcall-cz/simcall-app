"use client";

import { useState, useEffect, useCallback } from "react";
import type { CallRecord } from "@/types/dashboard";
import { adaptCallsToRecords } from "@/lib/adapters";

interface UseCallHistoryOptions {
  limit?: number;
  status?: string;
  autoFetch?: boolean;
}

interface UseCallHistoryReturn {
  calls: CallRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCallHistory(
  options: UseCallHistoryOptions = {}
): UseCallHistoryReturn {
  const { limit = 20, status, autoFetch = true } = options;
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });
      if (status) {
        params.set("status", status);
      }

      const response = await fetch(`/api/calls?${params}`);

      if (!response.ok) {
        throw new Error("Nepodařilo se načíst hovory");
      }

      const data = await response.json();
      const adapted = adaptCallsToRecords(data.calls || []);
      setCalls(adapted);
    } catch (err) {
      console.error("useCallHistory error:", err);
      setError(
        err instanceof Error ? err.message : "Nepodařilo se načíst hovory"
      );
    } finally {
      setIsLoading(false);
    }
  }, [limit, status]);

  useEffect(() => {
    if (autoFetch) {
      fetchCalls();
    }
  }, [autoFetch, fetchCalls]);

  return {
    calls,
    isLoading,
    error,
    refetch: fetchCalls,
  };
}
