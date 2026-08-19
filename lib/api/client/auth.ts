import { handleResponse } from "@/utils/api/handleResponse";

interface Response {
  success: boolean;
  message: string;
}

export const loginClient = async (emailOrUsername: string, password: string) => {
  const res = await fetch(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ emailOrUsername, password }),
    },
  )
  return handleResponse<Response>(res)
}

export const registerClient = async (username: string, email: string, password: string) => {
  const res = await fetch(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    },
  )
  return handleResponse<Response>(res)
}

export const verifyEmailClient = async (email: string, otp: string) => {
  const res = await fetch(
    "/api/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    },
  )
  return handleResponse<Response>(res)
}

export const resendOtpClient = async (email: string) => {
  const res = await fetch(
    "/api/auth/resend-otp",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  )
  return handleResponse<Response>(res)
}

export const logoutClient = async () => {
    return await fetch(
    "/api/auth/logout",
    {
      method: "POST",
    }
  )
}
