import { handleResponse } from "@/functions/handleResponse";

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

export const logoutClient = async () => {
    return await fetch(
    "/api/auth/logout",
    {
      method: "POST",
    }
  )
}
