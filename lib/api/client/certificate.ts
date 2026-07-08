import type { Certificate } from "@/types/domain";
import type { CertificateForm } from "@/types/form";
import { handleResponse } from "@/utils/api/handleResponse";
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
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("issuer", form.issuer);
  formData.append("issueDate", form.issueDate);

  if (form.expirationDate) {
    formData.append("expirationDate", form.expirationDate);
  }

  if (form.credentialId) {
    formData.append("credentialId", form.credentialId);
  }

  if (form.credentialUrl) {
    formData.append("credentialUrl", form.credentialUrl);
  }

  if (form.certificateImage) {
    formData.append("certificateImage", form.certificateImage);
  }

  const res = await fetchClient(
    "/api/certification",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  )

  return handleResponse<SingleResponse>(res);
}

export const updateCertificateClient = async (id: number, form: CertificateForm) => {
  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("issuer", form.issuer);
  formData.append("issueDate", form.issueDate);

  if (form.expirationDate) {
    formData.append("expirationDate", form.expirationDate);
  }

  if (form.credentialId) {
    formData.append("credentialId", form.credentialId);
  }

  if (form.credentialUrl) {
    formData.append("credentialUrl", form.credentialUrl);
  }

  if (form.certificateImage) {
    formData.append("certificateImage", form.certificateImage);
  }

  const res = await fetchClient(
    `/api/certification/${id}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
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