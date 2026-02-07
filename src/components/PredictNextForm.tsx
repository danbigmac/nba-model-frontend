"use client";

import React, { useMemo, useState } from "react";
import { ModelName, PredictNextRequest } from "@/types/global";
import {
  buildPredictNextPayload,
  createGameRow,
  hasPredictNextFormErrors,
  PredictNextGameRowInput,
  validatePredictNextForm,
} from "@/lib/predictNextFormUtils";

interface PredictNextFormProps {
  onStart: (req: PredictNextRequest) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function PredictNextForm({ onStart, isSubmitting = false }: PredictNextFormProps) {
  const [trainSeasons, setTrainSeasons] = useState("");
  const [season, setSeason] = useState("");
  const [models, setModels] = useState<ModelName[]>(["RandomForest"]);
  const [games, setGames] = useState<PredictNextGameRowInput[]>([createGameRow()]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const errors = useMemo(
    () => validatePredictNextForm(games, trainSeasons, season, models),
    [games, trainSeasons, season, models]
  );

  const isValid = !hasPredictNextFormErrors(errors);

  const updateGame = (id: string, patch: Partial<PredictNextGameRowInput>) => {
    setGames((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addGameRow = () => {
    setGames((prev) => [...prev, createGameRow()]);
  };

  const duplicateGameRow = (id: string) => {
    setGames((prev) => {
      const row = prev.find((r) => r.id === id);
      if (!row) return prev;
      return [
        ...prev,
        createGameRow({
          player: row.player,
          opponent: row.opponent,
          game_date: row.game_date,
          home_away: row.home_away,
          vegas_total: row.vegas_total,
          vegas_spread: row.vegas_spread,
        }),
      ];
    });
  };

  const removeGameRow = (id: string) => {
    setGames((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const toggleModel = (model: ModelName) => {
    setModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!isValid) return;

    await onStart(buildPredictNextPayload(games, trainSeasons, season, models));
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="bg-earth-50/70 border border-earth-200 rounded-xl p-6 shadow-sm space-y-5"
    >
      <h2 className="text-2xl font-serif text-forest-700 mb-2">Predict Next Game Points</h2>
      <p className="text-sm text-earth-700">
        Add one row per player-game matchup. Use Advanced Inputs only when you want to manually pass Vegas fields.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-earth-800 font-medium">Training Seasons</label>
          <input
            type="text"
            value={trainSeasons}
            onChange={(e) => setTrainSeasons(e.target.value)}
            placeholder="e.g. 2022-23, 2023-24, 2024-25"
            className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-earth-800 font-medium">Prediction Season</label>
          <input
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="e.g. 2025-26"
            className="w-full rounded-md border border-earth-300 p-2 focus:ring-2 focus:ring-forest-400 outline-none"
          />
        </div>
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-earth-900">Games</h3>
          <button
            type="button"
            onClick={addGameRow}
            className="px-3 py-1.5 rounded-md bg-forest-600 text-white text-sm hover:bg-forest-700"
          >
            Add Row
          </button>
        </div>

        {games.map((game, idx) => {
          const rowErrors = errors.rowById[game.id] ?? {};
          return (
            <div key={game.id} className="rounded-lg border border-earth-300 bg-earth-100/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-earth-900">Game {idx + 1}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => duplicateGameRow(game.id)}
                    className="px-2 py-1 text-xs rounded-md border border-earth-400 text-earth-800 hover:bg-earth-200"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGameRow(game.id)}
                    disabled={games.length === 1}
                    className="px-2 py-1 text-xs rounded-md border border-red-300 text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <label className="block text-sm text-earth-800 mb-1">Player</label>
                  <input
                    type="text"
                    value={game.player}
                    onChange={(e) => updateGame(game.id, { player: e.target.value })}
                    placeholder="LeBron James"
                    className="w-full rounded-md border border-earth-300 p-2 text-sm focus:ring-2 focus:ring-forest-400 outline-none"
                  />
                  {showErrors && rowErrors.player && <p className="mt-1 text-xs text-red-700">{rowErrors.player}</p>}
                </div>

                <div>
                  <label className="block text-sm text-earth-800 mb-1">Opponent</label>
                  <input
                    type="text"
                    value={game.opponent}
                    onChange={(e) =>
                      updateGame(game.id, {
                        opponent: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="BOS"
                    maxLength={3}
                    className="w-full rounded-md border border-earth-300 p-2 text-sm focus:ring-2 focus:ring-forest-400 outline-none"
                  />
                  {showErrors && rowErrors.opponent && (
                    <p className="mt-1 text-xs text-red-700">{rowErrors.opponent}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-earth-800 mb-1">Game Date</label>
                  <input
                    type="date"
                    value={game.game_date}
                    onChange={(e) => updateGame(game.id, { game_date: e.target.value })}
                    className="w-full rounded-md border border-earth-300 p-2 text-sm focus:ring-2 focus:ring-forest-400 outline-none"
                  />
                  {showErrors && rowErrors.game_date && (
                    <p className="mt-1 text-xs text-red-700">{rowErrors.game_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-earth-800 mb-1">Home/Away (optional)</label>
                  <select
                    value={game.home_away}
                    onChange={(e) =>
                      updateGame(game.id, {
                        home_away: e.target.value as "" | "home" | "away",
                      })
                    }
                    className="w-full rounded-md border border-earth-300 p-2 text-sm focus:ring-2 focus:ring-forest-400 outline-none bg-white"
                  >
                    <option value="">Infer if available</option>
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                  </select>
                  {showErrors && rowErrors.home_away && (
                    <p className="mt-1 text-xs text-red-700">{rowErrors.home_away}</p>
                  )}
                </div>
              </div>

              {showAdvanced && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm text-earth-800 mb-1">Vegas Total (optional)</label>
                    <input
                      type="text"
                      value={game.vegas_total}
                      onChange={(e) => updateGame(game.id, { vegas_total: e.target.value })}
                      placeholder="e.g. 228.5"
                      className="w-full rounded-md border border-earth-300 p-2 text-sm focus:ring-2 focus:ring-forest-400 outline-none"
                    />
                    {showErrors && rowErrors.vegas_total && (
                      <p className="mt-1 text-xs text-red-700">{rowErrors.vegas_total}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-earth-800 mb-1">Vegas Spread (optional)</label>
                    <input
                      type="text"
                      value={game.vegas_spread}
                      onChange={(e) => updateGame(game.id, { vegas_spread: e.target.value })}
                      placeholder="e.g. 4.5"
                      className="w-full rounded-md border border-earth-300 p-2 text-sm focus:ring-2 focus:ring-forest-400 outline-none"
                    />
                    {showErrors && rowErrors.vegas_spread && (
                      <p className="mt-1 text-xs text-red-700">{rowErrors.vegas_spread}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="text-sm text-forest-700 underline underline-offset-2"
        >
          {showAdvanced ? "Hide Advanced Inputs" : "Show Advanced Inputs"}
        </button>
      </div>

      {showErrors && errors.general.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3 text-sm">
          <ul className="list-disc list-inside space-y-1">
            {errors.general.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 rounded-lg shadow font-semibold transition-all duration-200 ease-in-out bg-forest-500 hover:bg-forest-600 text-white disabled:opacity-60"
      >
        {isSubmitting ? "Starting..." : "Start Next-Game Prediction"}
      </button>
    </form>
  );
}
