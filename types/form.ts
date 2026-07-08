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
  tagline: string;
  title: string;
  birthday: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: File | null;
}

export type SkillForm = {
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export type ExperienceForm = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
  logo: File | null;
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

export type CertificateForm = {
  title: string;
  issuer: string;
  issueDate: string;
  certificateImage: File | null;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
}

export type ProjectForm = {
  title: string;
  description: string;
  link: string;
  githubLink: string;
  status: string;
  isDraft: boolean;
}

export type TechnologyForm = {
  name: string;
  category: string;
}

export type PersonalAccessTokenForm = {
  name: string;
}

export type ProjectTechnologyForm = {
  techIds: number[];
}

export type ExperienceTechnologyForm = {
  techIds: number[];
}

export type LoginPayload = {
  'emailOrPassword': string;
  'password': string;
}
