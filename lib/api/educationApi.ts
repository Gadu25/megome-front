import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Education, EducationForm } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  education: Education[];
}

interface EducationApi {
  getEducation: (headers?: Headers) => Promise<XiorResponse<{ education: Education[] }>>;
  addEducation: (education: EducationForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  updateEducation: (id: number, education: Education, headers?: Headers) => Promise<XiorResponse<Response>>;
  deleteEducation: (id: number, headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const educationApi = (): EducationApi => {
  return {
    getEducation,
    addEducation,
    updateEducation,
    deleteEducation,
  }
}

const getEducation = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ education: Education[] }>(
    `${BACKEND_URL}/api/v1/education`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const addEducation = (education: EducationForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();
  
  formData.append("school", education.school);
  formData.append("degree", education.degree);
  formData.append("fieldOfStudy", education.fieldOfStudy);
  formData.append("startDate", education.startDate);
  formData.append("endDate", education.endDate);

  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/education`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const updateEducation = (id: number, education: Education, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("school", education.school);
  formData.append("degree", education.degree);
  formData.append("fieldOfStudy", education.fieldOfStudy);
  formData.append("startDate", education.startDate);
  formData.append("endDate", education.endDate);

  return xiorClient.put<Response>(
    `${BACKEND_URL}/api/v1/education/${id}`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const deleteEducation = (id: number, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.delete<Response>(
    `${BACKEND_URL}/api/v1/education/${id}`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}