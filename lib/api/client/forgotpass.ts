import { handleResponse } from "@/utils/api/handleResponse";

interface Response {
  success: boolean;
  message: string;
}

export const forgotPassClient = async (email: string) => {
  const res = await fetch(
    "/api/auth/forgot-pass",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  )
  return handleResponse<Response>(res)
}

export const resetPassClient = async (password: string, token: string) => {
  const res = await fetch(
    "/api/auth/forgot-pass/reset",
    {
      method: "POST", 
      body: JSON.stringify({ password, token }),
    },
  )
  return handleResponse<Response>(res)
}
