import type { Technology } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  technologies: Technology[];
}

export const getTechnologiesClient = async () => {
  const res = await fetchClient(
    "/api/technology",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res)
}

export const linkExperienceTechnologiesClient = async (id: number, techIds: number[]) => {
  const res = await fetchClient(
    `/api/experienceTech/${id}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ techIds }),
    },
  )

  return handleResponse<Response>(res);
}

export const linkProjectTechnologiesClient = async (id: number, techIds: number[]) => {
  const res = await fetchClient(
    `/api/technology/${id}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ techIds }),
    },
  )

  return handleResponse<Response>(res);
}