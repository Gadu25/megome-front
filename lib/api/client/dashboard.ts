import type { ActivityItem, CompletionStatus, DailyUsage, DashboardOverview } from "@/types/api";
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

interface ActivityResponse {
  message: string;
  data: ActivityItem[];
}

export const getDashboardActivity = async () => {
  const res = await fetchClient("/api/dashboard/activity", {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<ActivityResponse>(res);
};

interface UsageStatsResponse {
  message: string;
  data: DailyUsage[];
}

export const getDashboardUsageStats = async (days: number = 30) => {
  const res = await fetchClient(`/api/dashboard/usage-stats?days=${days}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<UsageStatsResponse>(res);
};