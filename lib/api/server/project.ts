import { ProjectFull } from "@/types/domain";
import { fetchWithAuth } from "./fetchWithAuth";
import { handleResponse } from "@/utils/api/handleResponse";

interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

interface Response {
  data: ProjectFull[];
  pagination: Pagination;
}

interface SingleResponse {
  message: string;
  project: ProjectFull;
}

export const getProjectServer = async (id: number): Promise<SingleResponse> => {
  const res = await fetchWithAuth(`/api/v1/project/${id}`);
  return handleResponse<SingleResponse>(res);
}

export const getProjectsServer = async (): Promise<Response> => {
  const res = await fetchWithAuth("/api/v1/project");
  return handleResponse<Response>(res);
}