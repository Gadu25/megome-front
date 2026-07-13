export type Profile = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  birthday: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export type Skill = {
  id: number;
  userId: number;
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  createdAt: string;
  updatedAt: string;
}

export type Experience = {
  id: number;
  userId: number;
  title: string;
  company: string;
  logo: string | null;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
  technologies: Technology[];
  createdAt: string;
  updatedAt: string;
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

export type Certificate = {
  id: number;
  userId: number;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  certificateImage: string | null;
  createdAt: string;
  updatedAt: string;
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

export type PersonalAccessToken = {
  id: number,
  userId: number,
  name: string;
  lastUsedAt: string;
  revokedAt: string;
  createdAt: string;
  updatedAt: string | null;
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
