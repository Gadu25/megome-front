import type { Certificate, CertificateForm } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";
import { fetchClient } from "./fetchClient";
import { handler } from "next/dist/build/templates/app-route";

interface Response {
  message: string;
  certificates: Certificate[];
}

interface SingleResponse {
  message: string;
  certificate: Certificate;
}

export const getCertificateClient = async () => {
  const res = await fetchClient(
    "/api/certification",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res)
}

export const addCertificateClient = async (form: CertificateForm) => {
  const res = await fetchClient(
    "/api/certification",
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

export const updateCertificateClient = async (id: number, form: CertificateForm) => {
  const res = await fetchClient(
    `/api/certification/${id}`,
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

 export const deleteCertificateClient = async (id: number) => {
  const res = await fetchClient(
    `/api/certification/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )

  return handleResponse<SingleResponse>(res);
 }