import type { DasboardOverview } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  data: DasboardOverview
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