import type { Skill, SkillForm } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  skills: Skill[];
}

interface SingleResponse {
  messsage: string;
  skill: Skill;
}

export const getSkillClient = async () => {
  const res = await fetchClient(
    "/api/skill",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res)
}

export const addSkillClient = async (form: SkillForm) => {
  const res = await fetchClient(
    "/api/skill",
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

export const updateSkillClient = async (id: number, form: SkillForm) => {
  const res = await fetchClient(
    `/api/skill/${id}`,
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

 export const deleteSkillClient = async (id: number) => {
  const res = await fetchClient(
    `/api/skill/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )

  return handleResponse<SingleResponse>(res);
 }