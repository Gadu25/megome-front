import type { DashboardOverview } from "@/types/api";
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