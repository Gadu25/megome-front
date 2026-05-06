import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Technology } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  technology: Technology[]
}

interface TechnologyApi {
  getTechnologies: (headers?: Headers) => Promise<XiorResponse<{ message: string, technologies: Technology[]}>>;
}

export const technologyApi = (): TechnologyApi => {
  return {
    getTechnologies,
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