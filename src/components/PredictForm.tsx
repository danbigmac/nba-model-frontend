"use client";

import React, { useState } from "react";
import { PredictRequest } from "@/types/global";

interface PredictFormProps {
  onStart: (req: PredictRequest) => void;
}

export default function PredictForm({ onStart }: PredictFormProps) {
  const [players, setPlayers] = useState<string>("");
  const [trainSeasons, setTrainSeasons] = useState<string>("");
  const [testSeason, setTestSeason] = useState<string>("");
  const [models, setModels] = useState<string[]>(["RandomForest"]);

  const toggleModel = (model: string) => {
    setModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req: PredictRequest = {
      players: players.split(",").map(p => p.trim()),
      train_seasons: trainSeasons.split(",").map(s => s.trim()),
      test_season: testSeason.trim(),
      models,
    };
    onStart(req);
  };

  // Determine if form is valid
  const isValid =
    players.trim().length > 0 &&
    trainSeasons.trim().length > 0 &&
    testSeason.trim().length > 0 &&
    models.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-earth-50/70 border border-earth-200 rounded-xl p-6 shadow-sm space-y-5"
    >
      <h2 className="text-2xl font-serif text-forest-700 mb-4">Run a Prediction</h2>

      <div className="space-y-3">
        <label className="block text-earth-800 font-medium">
          Player Names (comma separated)
        </label>
        <input
          type="text"
          value={players}
          onChange={e => setPlayers(e.target.value)}
          placeholder="e.g. LeBron James, Stephen Curry"
          className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-earth-800 font-medium">Training Seasons</label>
        <input
          type="text"
          value={trainSeasons}
          onChange={e => setTrainSeasons(e.target.value)}
          placeholder="e.g. 2021-22, 2022-23"
          className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-earth-800 font-medium">Test Season</label>
        <input
          type="text"
          value={testSeason}
          onChange={e => setTestSeason(e.target.value)}
          placeholder="e.g. 2023-24"
          className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-earth-800 font-medium">Select Models</label>
        <div className="flex space-x-4">
          {["RandomForest", "XGBoost"].map(model => (
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

      <button
        type="submit"
        disabled={!isValid}
        className={`px-6 py-2 rounded-lg shadow font-semibold transition-all duration-200 ease-in-out
          ${isValid
            ? "bg-forest-500 hover:bg-forest-600 text-white hover:shadow-lg hover:scale-[1.02]"
            : "bg-earth-300 text-earth-600 cursor-not-allowed opacity-70"
          }`}
      >
        Start Prediction
      </button>
    </form>
  );
}
