"use client";

import React from "react";
import { PredictNextStatusResponse } from "@/types/global";

interface PredictNextResultsViewProps {
  status: PredictNextStatusResponse;
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" ? value.toFixed(2) : "-";
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "-";
}

export default function PredictNextResultsView({ status }: PredictNextResultsViewProps) {
  if (status.status === "queued" || status.status === "running") {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-forest-400 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-earth-800">Processing next-game predictions...</p>
      </div>
    );
  }

  if (status.status === "failed" || status.status === "not found") {
    return (
      <div className="bg-earth-100 border border-earth-300 text-earth-800 rounded-lg p-4">
        <p className="font-semibold">Predict-next request failed.</p>
        {status.error && <p className="mt-1 text-sm">{status.error}</p>}
      </div>
    );
  }

  if (status.status !== "done") {
    return null;
  }

  const bestModelEntries = Object.entries(status.best_models ?? {});

  return (
    <div className="space-y-6">
      {bestModelEntries.length > 0 && (
        <div className="bg-earth-50 border border-earth-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-2xl font-serif text-forest-700">Best Pick By Player</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-earth-300 text-sm">
              <thead className="bg-forest-200 text-earth-900">
                <tr>
                  <th className="border border-earth-300 px-4 py-2">Player</th>
                  <th className="border border-earth-300 px-4 py-2">Best Model</th>
                  <th className="border border-earth-300 px-4 py-2">Predicted PTS</th>
                </tr>
              </thead>
              <tbody>
                {bestModelEntries.map(([player, best]) => (
                  <tr key={player} className="even:bg-earth-100/60 odd:bg-forest-50/50 text-earth-900">
                    <td className="border border-earth-300 px-4 py-2">{player}</td>
                    <td className="border border-earth-300 px-4 py-2">{best.model ?? "-"}</td>
                    <td className="border border-earth-300 px-4 py-2">{formatNumber(best.predicted_pts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {status.predictions.length > 0 ? (
        <div className="bg-earth-50 border border-earth-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-2xl font-serif text-forest-700">All Model Outputs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-earth-300 text-sm">
              <thead className="bg-forest-200 text-earth-900">
                <tr>
                  <th className="border border-earth-300 px-4 py-2">Player</th>
                  <th className="border border-earth-300 px-4 py-2">Opponent</th>
                  <th className="border border-earth-300 px-4 py-2">Date</th>
                  <th className="border border-earth-300 px-4 py-2">Model</th>
                  <th className="border border-earth-300 px-4 py-2">Model PTS</th>
                  <th className="border border-earth-300 px-4 py-2">Final PTS</th>
                  <th className="border border-earth-300 px-4 py-2">Validated</th>
                  <th className="border border-earth-300 px-4 py-2">Used Baseline</th>
                  <th className="border border-earth-300 px-4 py-2">Vegas Total</th>
                  <th className="border border-earth-300 px-4 py-2">Vegas Spread</th>
                  <th className="border border-earth-300 px-4 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {status.predictions.map((prediction, idx) => (
                  <tr
                    key={`${prediction.player}-${prediction.model}-${idx}`}
                    className="even:bg-earth-100/60 odd:bg-forest-50/50 text-earth-900"
                  >
                    <td className="border border-earth-300 px-4 py-2">{prediction.player}</td>
                    <td className="border border-earth-300 px-4 py-2">{prediction.opponent}</td>
                    <td className="border border-earth-300 px-4 py-2">{prediction.game_date}</td>
                    <td className="border border-earth-300 px-4 py-2">{prediction.model}</td>
                    <td className="border border-earth-300 px-4 py-2">
                      {formatNumber(prediction.model_predicted_pts)}
                    </td>
                    <td className="border border-earth-300 px-4 py-2">{formatNumber(prediction.predicted_pts)}</td>
                    <td className="border border-earth-300 px-4 py-2">{formatBoolean(prediction.validated)}</td>
                    <td className="border border-earth-300 px-4 py-2">{formatBoolean(prediction.used_baseline)}</td>
                    <td className="border border-earth-300 px-4 py-2">{formatNumber(prediction.vegas_total)}</td>
                    <td className="border border-earth-300 px-4 py-2">{formatNumber(prediction.vegas_spread)}</td>
                    <td className="border border-earth-300 px-4 py-2 text-red-700">{prediction.error ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-earth-50 border border-earth-200 rounded-xl p-6 shadow-sm">
          <p className="text-earth-800">Predict-next completed, but no prediction rows were returned.</p>
        </div>
      )}
    </div>
  );
}
