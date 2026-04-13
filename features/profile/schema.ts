import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
  phone: z.string().max(20, "Phone number must be at most 20 characters").optional(),
  website: z.string().url("Invalid URL").optional(),
  location: z.string().max(100, "Location must be at most 100 characters").optional(),
  profileImage: z.instanceof(File).optional(),
});