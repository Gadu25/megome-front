import type { PersonalAccessToken } from "@/types/domain";
import type { PersonalAccessTokenForm } from "@/types/form";
import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  pats: PersonalAccessToken[];
}

interface SingleResponse {
  message: string;
  pat: string;
}

export const getPatsClient = async () => {
  const res = await fetchClient(
      "/api/pat",
      {
        method: "GET",
        credentials: "include",
      }
    )
  
    return handleResponse<Response>(res);
}

export const addPatClient = async (form: PersonalAccessTokenForm) => {
  const res = await fetchClient(
    "/api/pat",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form)
    }
  )

  return handleResponse<SingleResponse>(res);
}

export const revokePatClient = async (id: number) => {
  const res = await fetchClient(
    `/api/pat/${id}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    }
  )

  return handleResponse<SingleResponse>(res);
}

export const deletePatClient = async (id: number) => {
  const res = await fetchClient(
    `/api/pat/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  )

  return handleResponse<SingleResponse>(res);
}

