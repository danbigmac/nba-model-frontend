import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPredictNextPayload,
  hasPredictNextFormErrors,
  isValidDateString,
  parseCsvList,
  validatePredictNextForm,
} from "@/lib/predictNextFormUtils";
import { ModelName } from "@/types/global";

const MODELS: ModelName[] = ["RandomForest"];

test("parseCsvList trims and removes empty values", () => {
  assert.deepEqual(parseCsvList(" 2022-23, ,2023-24 ,, 2024-25 "), [
    "2022-23",
    "2023-24",
    "2024-25",
  ]);
});

test("isValidDateString validates real calendar dates", () => {
  assert.equal(isValidDateString("2026-02-07"), true);
  assert.equal(isValidDateString("2024-02-29"), true);
  assert.equal(isValidDateString("2025-02-29"), false);
  assert.equal(isValidDateString("2026-13-01"), false);
});

test("validatePredictNextForm reports general and row-level errors", () => {
  const rows = [
    {
      id: "row-1",
      player: "",
      opponent: "BOSTON",
      game_date: "2026-02-30",
      home_away: "" as const,
      vegas_total: "abc",
      vegas_spread: "bad",
    },
  ];

  const errors = validatePredictNextForm(rows, "2022-23, bad", "2025-2", []);

  assert.equal(errors.general.includes("Training seasons must use YYYY-YY format."), true);
  assert.equal(errors.general.includes("Prediction season must use YYYY-YY format."), true);
  assert.equal(errors.general.includes("Select at least one model."), true);

  assert.equal(errors.rowById["row-1"].player, "Player is required.");
  assert.equal(
    errors.rowById["row-1"].opponent,
    "Opponent must be a 3-letter team code."
  );
  assert.equal(
    errors.rowById["row-1"].game_date,
    "Game date must be a valid YYYY-MM-DD date."
  );
  assert.equal(errors.rowById["row-1"].vegas_total, "Vegas total must be a number.");
  assert.equal(errors.rowById["row-1"].vegas_spread, "Vegas spread must be a number.");
  assert.equal(hasPredictNextFormErrors(errors), true);
});

test("validatePredictNextForm returns no errors for valid input", () => {
  const rows = [
    {
      id: "row-1",
      player: "LeBron James",
      opponent: "BOS",
      game_date: "2026-02-08",
      home_away: "home" as const,
      vegas_total: "228.5",
      vegas_spread: "4.0",
    },
  ];

  const errors = validatePredictNextForm(rows, "2022-23,2023-24", "2025-26", MODELS);

  assert.deepEqual(errors.general, []);
  assert.deepEqual(errors.rowById["row-1"], {});
  assert.equal(hasPredictNextFormErrors(errors), false);
});

test("buildPredictNextPayload normalizes values and omits optional blanks", () => {
  const rows = [
    {
      id: "row-1",
      player: " LeBron James ",
      opponent: " bos ",
      game_date: "2026-02-08",
      home_away: "" as const,
      vegas_total: "",
      vegas_spread: "",
    },
    {
      id: "row-2",
      player: "Stephen Curry",
      opponent: "lal",
      game_date: "2026-02-08",
      home_away: "away" as const,
      vegas_total: "231.5",
      vegas_spread: "-2.5",
    },
  ];

  const payload = buildPredictNextPayload(
    rows,
    " 2022-23 , 2023-24 ",
    " 2025-26 ",
    ["RandomForest", "XGBoost"]
  );

  assert.deepEqual(payload.train_seasons, ["2022-23", "2023-24"]);
  assert.equal(payload.season, "2025-26");
  assert.deepEqual(payload.models, ["RandomForest", "XGBoost"]);

  assert.deepEqual(payload.games[0], {
    player: "LeBron James",
    opponent: "BOS",
    game_date: "2026-02-08",
  });

  assert.deepEqual(payload.games[1], {
    player: "Stephen Curry",
    opponent: "LAL",
    game_date: "2026-02-08",
    home_away: "away",
    vegas_total: 231.5,
    vegas_spread: -2.5,
  });
});
