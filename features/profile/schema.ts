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