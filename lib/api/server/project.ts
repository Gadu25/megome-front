import { ProjectFull } from "@/types/types";
import { fetchWithAuth } from "./fetchWithAuth";
import { handleResponse } from "@/functions/handleResponse";

interface Response {
  message: string;
  projects: ProjectFull[];
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