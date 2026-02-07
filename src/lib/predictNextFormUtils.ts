import { ModelName, NextGameInput, PredictNextRequest } from "@/types/global";

export const SEASON_PATTERN = /^\d{4}-\d{2}$/;
export const OPPONENT_PATTERN = /^[A-Z]{3}$/;

export interface PredictNextGameRowInput {
  id: string;
  player: string;
  opponent: string;
  game_date: string;
  home_away: "" | "home" | "away";
  vegas_total: string;
  vegas_spread: string;
}

export interface RowErrors {
  player?: string;
  opponent?: string;
  game_date?: string;
  home_away?: string;
  vegas_total?: string;
  vegas_spread?: string;
}

export interface PredictNextFormErrors {
  general: string[];
  rowById: Record<string, RowErrors>;
}

function newRowId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createGameRow(
  seed?: Partial<Omit<PredictNextGameRowInput, "id">>
): PredictNextGameRowInput {
  return {
    id: newRowId(),
    player: seed?.player ?? "",
    opponent: seed?.opponent ?? "",
    game_date: seed?.game_date ?? "",
    home_away: seed?.home_away ?? "",
    vegas_total: seed?.vegas_total ?? "",
    vegas_spread: seed?.vegas_spread ?? "",
  };
}

export function parseCsvList(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  const [year, month, day] = value.split("-").map(Number);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

export function validatePredictNextForm(
  rows: PredictNextGameRowInput[],
  trainSeasonsRaw: string,
  seasonRaw: string,
  models: ModelName[]
): PredictNextFormErrors {
  const errors: PredictNextFormErrors = {
    general: [],
    rowById: {},
  };

  const trainSeasons = parseCsvList(trainSeasonsRaw);
  const season = seasonRaw.trim();

  if (trainSeasons.length === 0) {
    errors.general.push("Provide at least one training season.");
  }
  if (trainSeasons.some((trainSeason) => !SEASON_PATTERN.test(trainSeason))) {
    errors.general.push("Training seasons must use YYYY-YY format.");
  }
  if (!SEASON_PATTERN.test(season)) {
    errors.general.push("Prediction season must use YYYY-YY format.");
  }
  if (models.length === 0) {
    errors.general.push("Select at least one model.");
  }
  if (rows.length === 0) {
    errors.general.push("Add at least one game row.");
  }

  for (const row of rows) {
    const rowErrors: RowErrors = {};

    if (!row.player.trim()) {
      rowErrors.player = "Player is required.";
    }

    const opponent = row.opponent.trim().toUpperCase();
    if (!opponent) {
      rowErrors.opponent = "Opponent is required.";
    } else if (!OPPONENT_PATTERN.test(opponent)) {
      rowErrors.opponent = "Opponent must be a 3-letter team code.";
    }

    if (!row.game_date.trim()) {
      rowErrors.game_date = "Game date is required.";
    } else if (!isValidDateString(row.game_date.trim())) {
      rowErrors.game_date = "Game date must be a valid YYYY-MM-DD date.";
    }

    if (row.home_away && row.home_away !== "home" && row.home_away !== "away") {
      rowErrors.home_away = "Home/Away must be home or away.";
    }

    if (row.vegas_total.trim()) {
      const vegasTotal = Number(row.vegas_total);
      if (!Number.isFinite(vegasTotal)) {
        rowErrors.vegas_total = "Vegas total must be a number.";
      }
    }

    if (row.vegas_spread.trim()) {
      const vegasSpread = Number(row.vegas_spread);
      if (!Number.isFinite(vegasSpread)) {
        rowErrors.vegas_spread = "Vegas spread must be a number.";
      }
    }

    errors.rowById[row.id] = rowErrors;
  }

  return errors;
}

export function hasPredictNextFormErrors(errors: PredictNextFormErrors) {
  if (errors.general.length > 0) return true;
  return Object.values(errors.rowById).some(
    (rowErrors) => Object.keys(rowErrors).length > 0
  );
}

export function buildPredictNextPayload(
  rows: PredictNextGameRowInput[],
  trainSeasonsRaw: string,
  seasonRaw: string,
  models: ModelName[]
): PredictNextRequest {
  return {
    train_seasons: parseCsvList(trainSeasonsRaw),
    season: seasonRaw.trim(),
    models,
    games: rows.map((row): NextGameInput => {
      const game: NextGameInput = {
        player: row.player.trim(),
        opponent: row.opponent.trim().toUpperCase(),
        game_date: row.game_date.trim(),
      };

      if (row.home_away) {
        game.home_away = row.home_away;
      }
      if (row.vegas_total.trim()) {
        game.vegas_total = Number(row.vegas_total.trim());
      }
      if (row.vegas_spread.trim()) {
        game.vegas_spread = Number(row.vegas_spread.trim());
      }

      return game;
    }),
  };
}
