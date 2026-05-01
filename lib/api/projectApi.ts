import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Project, ProjectForm } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  project: Project;
}

interface ProjectApi {
  getProjects: (headers?: Headers) => Promise<XiorResponse<{ projects: Project[] }>>;
  addProject: (project: ProjectForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  updateProject: (id: number, project: ProjectForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  deleteProject: (id: number, headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const projectApi = (): ProjectApi => {
  return {
    getProjects,
    addProject,
    updateProject,
    deleteProject
  }
}

const getProjects = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ projects: Project[] }>(
    `${BACKEND_URL}/api/v1/project`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const addProject = (project: ProjectForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("title", project.title);
  formData.append("description", project.description);
  formData.append("link", project.link);
  formData.append("githubLink", project.githubLink);

  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/project`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const updateProject = (id: number, project: ProjectForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("title", project.title);
  formData.append("description", project.description);
  formData.append("link", project.link);
  formData.append("githubLink", project.githubLink);

  return xiorClient.put<Response>(
    `${BACKEND_URL}/api/v1/project/${id}`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const deleteProject = (id: number, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.delete<Response>(
    `${BACKEND_URL}/api/v1/project/${id}`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}