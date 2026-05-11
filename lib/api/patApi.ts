import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { PersonalAccessToken, PersonalAccessTokenForm } from "@/types/types";


const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface PatApi {
  getPATs: ( headers?: Headers) => Promise<XiorResponse<{ message: string, pats: PersonalAccessToken[]}>>;
  addPAT: (patForm: PersonalAccessTokenForm, headers?: Headers) => Promise<XiorResponse<{ message: string, pat: string }>>;
  revokePAT: (id: number, headers?:Headers) => Promise<XiorResponse<{ message: string }>>;
  deletePAT : (id: number, headers?:Headers) => Promise<XiorResponse<{ message: string }>>;
}

export const patApi = (): PatApi => {
  return {
    getPATs,
    addPAT,
    revokePAT,
    deletePAT,
  }
}

const getPATs = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ message: string, pats: PersonalAccessToken[] }>(
    `${BACKEND_URL}/api/v1/pat`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const addPAT = (patForm: PersonalAccessTokenForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.post<{ message: string, pat: string }>(
    `${BACKEND_URL}/api/v1/pat`,
    patForm,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const revokePAT = (id: number, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.post<{ message: string }>(
    `${BACKEND_URL}/api/v1/pat/${id}/revoke`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const deletePAT = (id:number, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.delete<{ message: string }>(
    `${BACKEND_URL}/api/v1/pat/${id}`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}