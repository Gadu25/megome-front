import { string } from "zod";

export type LoginResponse = {
  'access-token': string;
  'message': string;
};

export type LoginPayload = {
  'emailOrPassword': string;
  'password': string;
}

export type LogoutResponse = {
  'message': string;
}

export type Profile = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  title: string;
  birthday: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export type ProfileForm = {
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  birthday: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: File | null;
}

export type ProfilePayload = {
  firstName: string;
  lastName: string;
  title: string;
  birthday: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: File | null;
}

export type Skill = {
  id: number;
  userId: number;
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  createdAt: string;
  updatedAt: string;
}

export type SkillForm = {
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export type Experience = {
  id: number;
  userId: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ExperienceForm = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
}

export type Education = {
  id: number;
  userId: number;
  school: string;
  description: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EducationForm = {
  school: string;
  description: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
}

export type Project = {
  id: number;
  userId: number;
  title: string;
  description: string;
  link: string;
  githubLink: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectFull = {
  id: number;
  userId: number;
  title: string;
  description: string;
  link: string;
  githubLink: string;
  status: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  images: {
    cover?: string | null
    screenshots: string[]
  };
  technologies: Technology[]
}

export type ProjectForm = {
  title: string;
  description: string;
  link: string;
  githubLink: string;
  status: string;
  isDraft: boolean;
}

export type ProjectImage = {
  id?: number
  url?: string
  file?: File
  preview: string
  type: "cover" | "screenshot"
  status: "idle" | "uploading" | "uploaded" | "failed"
  error?: string
}

export type Image = {
  cover: ProjectImage | null
  screenshots: ProjectImage[]
}

export type Certificate = {
  id: number;
  userId: number;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CertificateForm = {
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
}

export type Technology = {
  id: number;
  createdByUserId: number | null;
  name: string;
  slug: string;
  category: string;
  isVerified: string;
  createdAt: string;
  updatedAt: string | null;
}

export type TechnologyForm = {
  name: string;
  category: string;
}

export type ProjectTechnologyForm = {
  techIds: number[];
}

export type PersonalAccessToken = {
  id: number,
  userId: number,
  name: string;
  lastUsedAt: string;
  revokedAt: string;
  createdAt: string;
  updatedAt: string | null;
}

export type PersonalAccessTokenForm = {
  name: string;
}

export type ApiUsageLog = {
  id: number,
  userId: number,
  tokenId: number,
  endpoint: string,
  method: string,
  statusCode: number,
  ipAddress: string,
  userAgent: string,
  responseTimeMs: Int16Array,
  createdAt: string,
}

export type ApiUsageLogWithtoken = {
  token: PersonalAccessToken,
  logs: ApiUsageLog[],
}

export type ApiUsage = {
  requestCount: number,
  averageResponseMs: number,
}

export type DasboardOverview = {
  apiUsage: ApiUsage,
  patCount: number,
}
