"use client";

import React from "react";
import { TaskStatusResponse } from "@/types/global";

interface ResultsViewProps {
  status: TaskStatusResponse;
}

export default function ResultsView({ status }: ResultsViewProps) {
  if (status.status === "queued" || status.status === "running") {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-forest-400 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-earth-800">Processing model predictions...</p>
      </div>
    );
  }

  if (status.status === "failed" || status.status === "not found") {
    return (
      <div className="bg-earth-100 border border-earth-300 text-earth-800 rounded-lg p-4">
        <p>Something went wrong while running your prediction.</p>
      </div>
    );
  }

  if (status.status === "done" && status.results.length > 0) {
    return (
      <div className="bg-earth-50 border border-earth-200 rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-2xl font-serif text-forest-700">Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-earth-300 text-sm">
            <thead className="bg-forest-200 text-earth-900">
              <tr>
                <th className="border border-earth-300 px-4 py-2">Player</th>
                <th className="border border-earth-300 px-4 py-2">Model</th>
                <th className="border border-earth-300 px-4 py-2">MAE</th>
                <th className="border border-earth-300 px-4 py-2">R²</th>
              </tr>
            </thead>
            <tbody>
              {status.results.map((r, idx) => (
                <tr
                  key={idx}
                  className="even:bg-earth-100/60 odd:bg-forest-50/50 text-earth-900"
                >
                  <td className="border border-earth-300 px-4 py-2">{r.player}</td>
                  <td className="border border-earth-300 px-4 py-2">{r.model}</td>
                  <td className="border border-earth-300 px-4 py-2">{r.metrics.MAE.toFixed(2)}</td>
                  <td className="border border-earth-300 px-4 py-2">{r.metrics.R2.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
