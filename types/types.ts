export type LoginResponse = {
  'access-token': string;
  'message': string;
};

export type LoginPayload = {
  'email': string;
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
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type Education = {
  id: number;
  userId: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type EducationForm = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export type Project = {
  id: number;
  userId: number;
  title: string;
  description: string;
  link: string;
  githubLink: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectForm = {
  title: string;
  description: string;
  link: string;
  githubLink: string;
}