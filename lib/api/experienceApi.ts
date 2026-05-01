import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Experience, ExperienceForm } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  experience: Experience;
}

interface ExperienceApi {
  getExperience: (headers?: Headers) => Promise<XiorResponse<{ experience: Experience[] }>>;
  addExperience: (experience: ExperienceForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  updateExperience: (id: number, experience: ExperienceForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  deleteExperience: (id: number, headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const experienceApi = (): ExperienceApi => {
  return {
    getExperience,
    addExperience,
    updateExperience,
    deleteExperience,
  }
}

const getExperience = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ experience: Experience[] }>(
    `${BACKEND_URL}/api/v1/experience`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const addExperience = (experience: ExperienceForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("title", experience.title);
  formData.append("company", experience.company);
  formData.append("startDate", experience.startDate);
  formData.append("endDate", experience.endDate);
  formData.append("description", experience.description);
  
  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/experience`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const updateExperience = (id: number, experience: ExperienceForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("title", experience.title);
  formData.append("company", experience.company);
  formData.append("startDate", experience.startDate);
  formData.append("endDate", experience.endDate);
  formData.append("description", experience.description);

  return xiorClient.put<Response>(
    `${BACKEND_URL}/api/v1/experience/${id}`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const deleteExperience = (id: number, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.delete<Response>(
    `${BACKEND_URL}/api/v1/experience/${id}`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}