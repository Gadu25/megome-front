import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Certificate, CertificateForm } from "@/types/types";
import { $ZodNumberInternals } from "zod/v4/core";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  certificates: Certificate[];
}

interface CertificateApi {
  getCertificate: (headers?: Headers) => Promise<XiorResponse<{ certificates: Certificate[]}>>;
  addCertificate: (certificate: CertificateForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  updateCertificate: (id: number, certificate: CertificateForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  deleteCertificate: (id: number, headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const certificateApi = (): CertificateApi => {
  return {
    getCertificate,
    addCertificate,
    updateCertificate,
    deleteCertificate,
  }
}

const getCertificate = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ certificates: Certificate[] }>(
    `${BACKEND_URL}/api/v1/certification`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const addCertificate = (certificate: CertificateForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("title", certificate.title);
  formData.append("issuer", certificate.issuer);
  formData.append("issueDate", certificate.issueDate);
  formData.append("expirationDate", certificate.expirationDate);
  formData.append("credentialId", certificate.credentialId);
  formData.append("credentialUrl", certificate.credentialUrl);

  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/certification`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const updateCertificate = (id: number, certificate: CertificateForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("title", certificate.title);
  formData.append("issuer", certificate.issuer);
  formData.append("issueDate", certificate.issueDate);
  formData.append("expirationDate", certificate.expirationDate);
  formData.append("credentialId", certificate.credentialId);
  formData.append("credentialUrl", certificate.credentialUrl);

  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/certification/${id}`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const deleteCertificate = (id: number, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.delete<Response>(
    `${BACKEND_URL}/api/v1/certification/${id}`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}