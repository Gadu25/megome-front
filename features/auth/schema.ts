import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(4, "Username is required"),
  email: z.string().email("invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(4, "Email or Username is required"),
  password: z.string().min(6, "password must be at least 6 characters"),
})