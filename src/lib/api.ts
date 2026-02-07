import {
  PredictNextRequest,
  PredictNextStatusResponse,
  PredictRequest,
  TaskInitResponse,
  TaskStatusResponse,
} from "@/types/global";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }
  return baseUrl.replace(/\/+$/, "");
}

async function parseResponseBody(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(body: unknown, status: number) {
  if (typeof body === "string" && body.trim().length > 0) {
    return body;
  }
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim().length > 0) {
      return detail;
    }
  }
  return `API request failed with status ${status}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, init);
  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(body, res.status), res.status, body);
  }

  return body as T;
}

export function startPrediction(req: PredictRequest) {
  return requestJson<TaskInitResponse>("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
}

export function getResults(task_id: string) {
  return requestJson<TaskStatusResponse>(`/results/${task_id}`);
}

export function startPredictNext(req: PredictNextRequest) {
  return requestJson<TaskInitResponse>("/predict-next", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
}

export function getNextResults(task_id: string) {
  return requestJson<PredictNextStatusResponse>(`/next-results/${task_id}`);
}
