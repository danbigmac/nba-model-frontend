"use client";

import React, { useState, useEffect } from "react";
import PredictForm from "@/components/PredictForm";
import ResultsView from "@/components/ResultsView";
import { PredictRequest, TaskStatusResponse } from "@/types/global";
import { startPrediction, getResults } from "@/lib/api";

export default function App() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatusResponse | null>(null);

  const handleStart = async (req: PredictRequest) => {
    const res = await startPrediction(req);
    setTaskId(res.task_id);
    setStatus({ task_id: res.task_id, status: res.status, results: [], error: null });
  };

  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      const res = await getResults(taskId);
      setStatus(res);
      if (res.status === "done" || res.status === "failed") clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [taskId]);

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
        </header>

        <section className="space-y-6">
          <PredictForm onStart={handleStart} />
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
