export interface PredictRequest {
  players: string[];
  train_seasons: string[];
  test_season: string;
  models: string[];
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
  status: "queued" | "running" | "done" | "failed" | "not found";
  results: PlayerModelResult[];
  error: string | null;
}
