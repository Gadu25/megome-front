import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Skill, SkillForm } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  skills: Skill[];
}

interface SkillApi {
  addSkill: (skill: SkillForm, headers?: Headers) => Promise<XiorResponse<Response>>;
  getSkills: (headers?: Headers) => Promise<XiorResponse<{ skills: Skill[] }>>;
  updateSkill: (id: number, skill: SkillForm, headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const skillApi = (): SkillApi => {
  return {
    addSkill,
    updateSkill,
    getSkills,
  }
}

const addSkill = (skill: SkillForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();
  
  formData.append("skillName", skill.skillName);
  formData.append("proficiency", skill.proficiency);

  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/skill`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const updateSkill = (id: number, skill: SkillForm, headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("skillName", skill.skillName);
  formData.append("proficiency", skill.proficiency);

  return xiorClient.put<Response>(
    `${BACKEND_URL}/api/v1/skill/${id}`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}

const getSkills = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");

  return xiorClient.get<{ skills: Skill[] }>(
    `${BACKEND_URL}/api/v1/skill`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
}