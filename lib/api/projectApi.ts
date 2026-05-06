import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Project, ProjectForm, ProjectImage} from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  project: Project;
}

interface SingleImageResponse {
  message: string;
  image: ProjectImage
}

interface ProjectApi {
  getProjects: (headers?: Headers) => Promise<XiorResponse<{ projects: Project[] }>>;
  addProject: (project: ProjectForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  updateProject: (id: number, project: ProjectForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  deleteProject: (id: number, headers?: Headers) => Promise<XiorResponse<Response>>;

  // images
  uploadProjectImage: (id: number, projectImage: ProjectImage, headers?: Headers) => Promise<XiorResponse<SingleImageResponse>>;
  uploadCoverImage: (id: number, projectCover: ProjectImage, headers?: Headers) => Promise<XiorResponse<SingleImageResponse>>;
}

export const projectApi = (): ProjectApi => {
  return {
    getProjects,
    addProject,
    updateProject,
    deleteProject,

    // images
    uploadProjectImage,
    uploadCoverImage,
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
  formData.append("status", project.status);

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
  formData.append("status", project.status);
  formData.append("isDraft", String(project.isDraft));

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

const uploadProjectImage = (id: number, projectImage : ProjectImage, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  if (projectImage.file) {
    formData.append("image", projectImage.file);
    console.log("file", projectImage.file)
  }
  formData.append("type", projectImage.type);

  return xiorClient.post<SingleImageResponse>(
    `${BACKEND_URL}/api/v1/project/${id}/images`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}

const uploadCoverImage = (id: number, projectCover: ProjectImage, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  if (projectCover.file) {
    formData.append("image", projectCover.file);
    console.log("file", projectCover.file)
  }
  formData.append("type", projectCover.type);

  return xiorClient.put<SingleImageResponse>(
    `${BACKEND_URL}/api/v1/project/${id}/cover`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  )
}