import type { Project, ProjectForm, ProjectImage, ProjectFull } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  projects: ProjectFull[];
}

interface SingleResponse {
  message: string;
  project: ProjectFull;
}

export const getProjectClient = async (id: number) => {
  const res = await fetchClient(
    `/api/project/${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<SingleResponse>(res);
}

export const getProjectsClient = async () => {
  const res = await fetchClient(
    "/api/project",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res);
}

export const addProjectClient = async (form: ProjectForm) => {
  const res = await fetchClient(
    "/api/project",
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form)
    }
  )

  return handleResponse<SingleResponse>(res);
}

export const deleteProjectClient = async (id: number) => {
  const res = await fetchClient(
    `/api/project/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )

  return handleResponse<SingleResponse>(res);
}