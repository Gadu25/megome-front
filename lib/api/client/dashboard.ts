import type { CompletionStatus, DashboardOverview } from "@/types/api";
import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  data: DashboardOverview
}

export const getDashboardOverview = async () => {
  const res = await fetchClient(
    "/api/dashboard",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res)
}

interface CompletionResponse {
  message: string;
  data: CompletionStatus
}

export const getCompletion = async () => {
  const res = await fetchClient(
    "/api/v1/completion",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<CompletionResponse>(res)
}