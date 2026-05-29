import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().max(600, "Bio must be at most 600 characters").optional(),
  phone: z.string().max(20, "Phone number must be at most 20 characters").optional(),
  website: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url("Invalid URL").optional()
  ),
  location: z.string().max(100, "Location must be at most 100 characters").optional(),
  // profileImage: z.instanceof(File).optional(),
});

export const skillSchema = z.object({
  skillName: z.string().min(1, "Skill name is required"),
  proficiency: z.string().min(1, "Proficiency is required"),
});

export const educationSchema = z.object({
  school: z.string().min(1, "Institution name is required"),
  description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description is too long"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isPresent: z.boolean(),
})
.refine(
  (data) => {
    if (data.isPresent) return true;
    return !!data.endDate && data.endDate.trim().length > 0;
  },
  {
    message: "End date is required",
    path: ["endDate"],
  }
);

export const experienceSchema = z.object({
    title: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isPresent: z.boolean(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description is too long"),
  })
  .refine(
    (data) => {
      if (data.isPresent) return true;
      return !!data.endDate && data.endDate.trim().length > 0;
    },
    {
      message: "End date is required",
      path: ["endDate"],
    }
  );