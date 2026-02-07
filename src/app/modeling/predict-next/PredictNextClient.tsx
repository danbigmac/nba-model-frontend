"use client";

import React, { useEffect, useState } from "react";
import PredictNextForm from "@/components/PredictNextForm";
import PredictNextResultsView from "@/components/PredictNextResultsView";
import ModelingModeNav from "@/components/ModelingModeNav";
import { PredictNextRequest, PredictNextStatusResponse } from "@/types/global";
import { getNextResults, startPredictNext } from "@/lib/api";
import { useTaskPolling } from "@/hooks/useTaskPolling";

export default function PredictNextClient() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const { status, setStatus, pollError, setPollError } = useTaskPolling<PredictNextStatusResponse>({
    taskId,
    getStatus: getNextResults,
  });

  const handleStart = async (req: PredictNextRequest) => {
    setIsStarting(true);
    try {
      setSubmissionError(null);
      const res = await startPredictNext(req);
      setTaskId(res.task_id);
      setStatus({
        task_id: res.task_id,
        status: res.status,
        predictions: [],
        error: null,
        best_models: null,
      });
      setPollError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start next-game prediction.";
      setSubmissionError(message);
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (!taskId) {
      setStatus(null);
      setPollError(null);
    }
  }, [taskId, setPollError, setStatus]);

  return (
    <div className="min-h-screen bg-forest-50 text-earth-900 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-forest-100 shadow-md rounded-2xl p-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-serif text-forest-700 mb-2">NBA Next-Game Predictor</h1>
          <p className="text-earth-700">Generate per-player point predictions for upcoming matchups.</p>
          <div className="mt-4 flex justify-center">
            <ModelingModeNav />
          </div>
        </header>

        <section className="space-y-6">
          <PredictNextForm onStart={handleStart} isSubmitting={isStarting} />

          {submissionError && (
            <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3">{submissionError}</div>
          )}

          {pollError && (
            <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3">{pollError}</div>
          )}

          {status && <PredictNextResultsView status={status} />}
        </section>
      </div>
    </div>
  );
}
