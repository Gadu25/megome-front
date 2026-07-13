import type { Project, ProjectFull } from "@/types/domain";
import type { ProjectForm } from "@/types/form";
import type { ProjectImage } from "@/types/ui";
import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  projects: ProjectFull[];
}

interface SingleResponse {
  message: string;
  project: ProjectFull;
}

interface SingleImageResponse {
  message: string;
  image: ProjectImage
}

export const getProjectClient = async (id: number) => {
  const res = await fetchClient(
    `/api/project/${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<SingleResponse>(res);
}

export const getProjectsClient = async () => {
  const res = await fetchClient(
    "/api/project",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res);
}

export const addProjectClient = async (form: ProjectForm) => {
  const res = await fetchClient(
    "/api/project",
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

export const updateProjectClient = async (id: number, form: ProjectForm) => {
  const res = await fetchClient(
    `/api/project/${id}`,
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

export const deleteProjectClient = async (id: number) => {
  const res = await fetchClient(
    `/api/project/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )

  return handleResponse<SingleResponse>(res);
}

export const uploadProjectImageClient = async (id: number, projectImage : ProjectImage) => {
  const formData = new FormData();

  if (projectImage.file) {
    formData.append("image", projectImage.file);
  }
  formData.append("type", projectImage.type);

  const res = await fetchClient(`/api/project/${id}/images`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  return handleResponse<SingleImageResponse>(res);
}

export const uploadCoverImageClient = async (id: number, projectCover: ProjectImage) => {
  const formData = new FormData();

  if (projectCover.file) {
    formData.append("image", projectCover.file);
  }
  formData.append("type", projectCover.type);

  const res = await fetchClient(`/api/project/${id}/cover`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  })

  return handleResponse<SingleImageResponse>(res);
}