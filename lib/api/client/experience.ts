import type { Experience, ExperienceForm } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  experiences: Experience[];
}

interface SingleResponse {
  message: string;
  experience: Experience;
}

export const getExperienceClient = async () => {
  const res = await fetchClient(
    "/api/experience",
    {
      method: "GET",
      credentials: "include",
    }
  )
  
  return handleResponse<Response>(res)
}

export const addExperienceClient = async (form: ExperienceForm) => {
  const res = await fetchClient(
    "/api/experience",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    },
  )

  return handleResponse<SingleResponse>(res);
}

export const updateExperienceClient = async (id: number, form: ExperienceForm) => {
  const res = await fetchClient(
    `/api/experience/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    },
  )

  return handleResponse<SingleResponse>(res);
}

 export const deleteExperienceClient = async (id: number) => {
  const res = await fetchClient(
    `/api/experience/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )

  return handleResponse<SingleResponse>(res);
 }