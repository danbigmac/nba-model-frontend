import { PredictRequest } from "@/types/global";
//const API_BASE = "http://localhost:8000";

export async function startPrediction(req: PredictRequest) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return await res.json(); // { task_id, status }
}

export async function getResults(task_id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/results/${task_id}`);
  return await res.json(); // { status, results }
}
