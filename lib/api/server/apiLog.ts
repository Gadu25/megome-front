import { ApiUsageLogWithtoken } from "@/types/types";
import { fetchWithAuth } from "./fetchWithAuth";
import { handleResponse } from "@/functions/handleResponse";

interface Response {
  message: string;
  data: ApiUsageLogWithtoken;
}

export const getTokenLogsServer = async (id: number): Promise<Response> => {
  const res = await fetchWithAuth(`/api/v1/api-logs/token/${id}`);
  return handleResponse<Response>(res);
}