"use client";

import React, { useEffect, useState } from "react";
import PredictForm from "@/components/PredictForm";
import ResultsView from "@/components/ResultsView";
import ModelingModeNav from "@/components/ModelingModeNav";
import { PredictRequest, TaskStatusResponse } from "@/types/global";
import { startPrediction, getResults } from "@/lib/api";
import { useTaskPolling } from "@/hooks/useTaskPolling";

export default function App() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { status, setStatus, pollError, setPollError } = useTaskPolling<TaskStatusResponse>({
    taskId,
    getStatus: getResults,
  });

  const handleStart = async (req: PredictRequest) => {
    try {
      setSubmissionError(null);
      const res = await startPrediction(req);
      setTaskId(res.task_id);
      setStatus({ task_id: res.task_id, status: res.status, results: [], error: null });
      setPollError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start prediction.";
      setSubmissionError(message);
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
      <div className="max-w-5xl mx-auto bg-forest-100 shadow-md rounded-2xl p-8 space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-serif text-forest-700 mb-2">
            NBA Player Performance Predictor
          </h1>
          <p className="text-earth-700">
            Compare models like Random Forest and XGBoost across seasons.
          </p>
          <div className="mt-4 flex justify-center">
            <ModelingModeNav />
          </div>
        </header>

        <section className="space-y-6">
          <PredictForm onStart={handleStart} />
          {submissionError && (
            <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3">
              {submissionError}
            </div>
          )}
          {pollError && (
            <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3">
              {pollError}
            </div>
          )}
          {status && (
            <div className="mt-8">
              <ResultsView status={status} />
            </div>
          )}
        </section>

        <footer className="text-center text-sm text-earth-700/80 mt-12">
          Built with <span className="text-forest-600 font-semibold">Tailwind CSS</span> and FastAPI
        </footer>
      </div>
    </div>
  );
}
