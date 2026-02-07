"use client";

import { useEffect, useState } from "react";
import { TaskStatus } from "@/types/global";

const TERMINAL_STATUSES: TaskStatus[] = ["done", "failed", "not found"];

interface UseTaskPollingArgs<TStatus extends { status: TaskStatus }> {
  taskId: string | null;
  getStatus: (taskId: string) => Promise<TStatus>;
  pollIntervalMs?: number;
}

export function useTaskPolling<TStatus extends { status: TaskStatus }>({
  taskId,
  getStatus,
  pollIntervalMs = 3000,
}: UseTaskPollingArgs<TStatus>) {
  const [status, setStatus] = useState<TStatus | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    let active = true;

    const pollOnce = async () => {
      try {
        const next = await getStatus(taskId);
        if (!active) return;
        setStatus(next);
        setPollError(null);
        if (TERMINAL_STATUSES.includes(next.status)) {
          active = false;
        }
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Failed to fetch task status.";
        setPollError(message);
      }
    };

    void pollOnce();

    const intervalId = setInterval(async () => {
      if (!active) {
        clearInterval(intervalId);
        return;
      }
      await pollOnce();
      if (!active) {
        clearInterval(intervalId);
      }
    }, pollIntervalMs);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [taskId, getStatus, pollIntervalMs]);

  return {
    status,
    setStatus,
    pollError,
    setPollError,
  };
}
