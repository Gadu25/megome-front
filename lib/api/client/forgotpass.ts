import { handleResponse } from "@/functions/handleResponse";

interface Response {
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

export const resetPassClient = async (newPass: string) => {
  const res = await fetch(
    "/api/auth/forgot-pass/reset",
    {
      method: "POST", 
      body: JSON.stringify({ newPass }),
    },
  )
  return handleResponse<Response>(res)
}
