export interface PredictRequest {
  players: string[];
  train_seasons: string[];
  test_season: string;
  models: string[];
}

export type ModelName = "RandomForest" | "XGBoost";
export type TaskStatus = "queued" | "running" | "done" | "failed" | "not found";

export interface TaskInitResponse {
  task_id: string;
  status: TaskStatus;
}

export interface Metrics {
  MAE: number;
  R2: number;
  Baseline_MAE: number;
}

export interface PlayerModelResult {
  player: string;
  model: string;
  train_seasons: string[];
  test_season: string;
  metrics: Metrics;
}

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  results: PlayerModelResult[];
  error: string | null;
}

export interface NextGameInput {
  player: string;
  opponent: string;
  game_date: string;
  home_away?: "home" | "away";
  vegas_total?: number;
  vegas_spread?: number;
}

export interface PredictNextRequest {
  games: NextGameInput[];
  train_seasons: string[];
  season: string;
  models: ModelName[];
}

export interface NextGamePrediction {
  player: string;
  opponent: string;
  game_date: string;
  home_away: string;
  model: string;
  predicted_pts: number | null;
  model_predicted_pts?: number | null;
  vegas_total?: number | null;
  vegas_spread?: number | null;
  used_baseline?: boolean | null;
  validated?: boolean | null;
  error?: string | null;
}

export interface BestModelPick {
  model: string | null;
  predicted_pts: number | null;
}

export type BestModelsByPlayer = Record<string, BestModelPick>;

export interface PredictNextStatusResponse {
  task_id: string;
  status: TaskStatus;
  predictions: NextGamePrediction[];
  error: string | null;
  best_models?: BestModelsByPlayer | null;
}
