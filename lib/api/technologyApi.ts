import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Technology, ProjectTechnologyForm } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  technology: Technology[]
}

interface TechnologyApi {
  getTechnologies: (headers?: Headers) => Promise<XiorResponse<{ message: string, technologies: Technology[]}>>;
  linkProjectTechnologies: (id: number, projectTech: number[], headers?: Headers) => Promise<XiorResponse<{ message: string }>>;
}

export const technologyApi = (): TechnologyApi => {
  return {
    getTechnologies,
    linkProjectTechnologies,
  }
}

const getTechnologies = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ message: string, technologies: Technology[] }>(
    `${BACKEND_URL}/api/v1/technology`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const linkProjectTechnologies = (id: number, techIds: number[], headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("techIds", JSON.stringify(techIds))

  return xiorClient.post<{ message: string }>(
    `${BACKEND_URL}/api/v1/projectTech/${id}/batch`,
    {
      techIds: techIds
    },
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}