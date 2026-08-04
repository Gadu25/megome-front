import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

export type AssistTask =
  | "generate_bio"
  | "generate_tagline"
  | "generate_project_description"
  | "generate_experience"
  | "generate_education";

export type AiStatus = {
  available: boolean;
  cooldownRemainingSeconds: number;
};

interface AssistResponse {
  message: string;
  data: {
    task: AssistTask;
    fields: Record<string, string>;
  };
}

interface StatusResponse {
  message: string;
  data: AiStatus;
}

export const assistClient = async (
  task: AssistTask,
  context: Record<string, string>,
  extra = ""
) => {
  const res = await fetchClient("/api/ai/assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, context, extra }),
  });

  return handleResponse<AssistResponse>(res);
};

export const getAiStatusClient = async () => {
  const res = await fetchClient("/api/ai/status", { method: "GET" });
  return handleResponse<StatusResponse>(res);
};
