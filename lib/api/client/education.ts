import type { Education } from "@/types/domain";
import type { EducationForm } from "@/types/form";
import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  educations: Education[];
}

interface SingleResponse {
  message: string;
  education: Education;
}

export const getEducationClient = async () => {
  const res = await fetchClient(
    "/api/education",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res)
}

export const addEducationClient = async (form: EducationForm) => {
  const res = await fetchClient(
    "/api/education",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    },
  )

  return handleResponse<SingleResponse>(res)
}

export const updateEducationClient = async (id: number, form: EducationForm) => {
  const res = await fetchClient(
    `/api/education/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  )

  return handleResponse<SingleResponse>(res)
}

 export const deleteEducationClient = async (id: number) => {
  const res = await fetchClient(
    `/api/education/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )

  return handleResponse<SingleResponse>(res)
 }