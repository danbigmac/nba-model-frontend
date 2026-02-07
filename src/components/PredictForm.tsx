"use client";

import React, { useState } from "react";
import { ModelName, PredictRequest } from "@/types/global";

const SEASON_PATTERN = /^\d{4}-\d{2}$/;

interface PredictFormProps {
  onStart: (req: PredictRequest) => void;
}

export default function PredictForm({ onStart }: PredictFormProps) {
  const [players, setPlayers] = useState("");
  const [trainSeasons, setTrainSeasons] = useState("");
  const [testSeason, setTestSeason] = useState("");
  const [models, setModels] = useState<ModelName[]>(["RandomForest"]);
  const [showErrors, setShowErrors] = useState(false);

  const playerList = players
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const trainSeasonList = trainSeasons
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const normalizedTestSeason = testSeason.trim();

  const validationErrors: string[] = [];
  if (playerList.length === 0) {
    validationErrors.push("Provide at least one player.");
  }
  if (trainSeasonList.length === 0) {
    validationErrors.push("Provide at least one training season.");
  }
  if (trainSeasonList.some((season) => !SEASON_PATTERN.test(season))) {
    validationErrors.push("Training seasons must use YYYY-YY format.");
  }
  if (!SEASON_PATTERN.test(normalizedTestSeason)) {
    validationErrors.push("Test season must use YYYY-YY format.");
  }
  if (models.length === 0) {
    validationErrors.push("Select at least one model.");
  }

  const isValid = validationErrors.length === 0;

  const toggleModel = (model: ModelName) => {
    setModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!isValid) return;

    const req: PredictRequest = {
      players: playerList,
      train_seasons: trainSeasonList,
      test_season: normalizedTestSeason,
      models,
    };

    onStart(req);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-earth-50/70 border border-earth-200 rounded-xl p-6 shadow-sm space-y-5"
    >
      <h2 className="text-2xl font-serif text-forest-700 mb-4">Run a Prediction</h2>

      <div className="space-y-3">
        <label className="block text-earth-800 font-medium">Player Names (comma separated)</label>
        <input
          type="text"
          value={players}
          onChange={(e) => setPlayers(e.target.value)}
          placeholder="e.g. LeBron James, Stephen Curry"
          className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-earth-800 font-medium">Training Seasons</label>
        <input
          type="text"
          value={trainSeasons}
          onChange={(e) => setTrainSeasons(e.target.value)}
          placeholder="e.g. 2021-22, 2022-23"
          className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-earth-800 font-medium">Test Season</label>
        <input
          type="text"
          value={testSeason}
          onChange={(e) => setTestSeason(e.target.value)}
          placeholder="e.g. 2023-24"
          className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-earth-800 font-medium">Select Models</label>
        <div className="flex space-x-4">
          {(["RandomForest", "XGBoost"] as ModelName[]).map((model) => (
            <label key={model} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={models.includes(model)}
                onChange={() => toggleModel(model)}
                className="h-4 w-4 text-forest-600 focus:ring-forest-400 border-earth-400 rounded"
              />
              <span className="text-earth-800">{model}</span>
            </label>
          ))}
        </div>
      </div>

      {showErrors && !isValid && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3 text-sm">
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="px-6 py-2 rounded-lg shadow font-semibold transition-all duration-200 ease-in-out bg-forest-500 hover:bg-forest-600 text-white hover:shadow-lg hover:scale-[1.02]"
      >
        Start Prediction
      </button>
    </form>
  );
}
