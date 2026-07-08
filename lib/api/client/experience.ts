import type { Experience } from "@/types/domain";
import type { ExperienceForm } from "@/types/form";
import { handleResponse } from "@/utils/api/handleResponse";
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
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("company", form.company);
  formData.append("startDate", form.startDate);
  formData.append("isPresent", String(form.isPresent));

  if (form.endDate) {
    formData.append("endDate", form.endDate);
  }

  if (form.logo) {
    formData.append("logo", form.logo);
  }

  const res = await fetchClient(
    "/api/experience",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  )

  return handleResponse<SingleResponse>(res);
}

export const updateExperienceClient = async (id: number, form: ExperienceForm) => {
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("company", form.company);
  formData.append("startDate", form.startDate);
  formData.append("isPresent", String(form.isPresent));

  if (form.endDate) {
    formData.append("endDate", form.endDate);
  }

  if (form.logo) {
    formData.append("logo", form.logo);
  }

  const res = await fetchClient(
    `/api/experience/${id}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
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
