// import { apiFetch } from "./api"
// import { LoginResponse, LoginPayload, LogoutResponse } from "@/types/types";

// export async function login(payload: LoginPayload): Promise<LoginResponse> {
//   return apiFetch<LoginResponse>("/api/v1/auth/login", {
//     method: "POST",
//     body: JSON.stringify(payload),
//     credentials: "include",
//   });
// }

// export async function logout(): Promise<LogoutResponse> {
//   return apiFetch<LoginResponse>("/api/v1/auth/logout", {
//     method: "POST",
//   })
// }

import { XiorResponse } from "xior";
import xiorClient from "./xior";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Response {
  success: boolean;
}

interface AuthApi {
  login: (email: string, password: string) => Promise<XiorResponse<Response>>;
  logout: (headers?: Headers) => Promise<XiorResponse<Response>>;
  verifyAccessToken: (headers?: Headers) => Promise<XiorResponse<Response>>;
  refreshAccessToken: (headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const authApi = (): AuthApi => {
  return {
    login,
    logout,
    verifyAccessToken,
    refreshAccessToken,
  }
}

// 🔧 helper
const toPlainHeaders = (headers?: Headers) => {
  return headers ? Object.fromEntries(headers.entries()) : undefined;
};

const login = (email: string, password: string) => {
  return xiorClient.post<Response>(
    `${API_URL}/api/v1/auth/login`,
    { email, password }
  );
};

const logout = (headers?: Headers) => {
  return xiorClient.post<Response>(
    `${API_URL}/api/v1/auth/logout`,
    null,
    {
      headers: toPlainHeaders(headers),
    }
  );
};

const verifyAccessToken = (headers?: Headers) => {
  const plainHeaders = headers
    ? Object.fromEntries(headers.entries())
    : undefined;

  return xiorClient.post<Response>(
    `${API_URL}/api/v1/auth/verify`,
    null,
    { headers: plainHeaders } // <- this ensures Xior sends the cookies
  );
};

const refreshAccessToken = (headers?: Headers) => {
  return xiorClient.post<Response>(
    `${API_URL}/api/v1/auth/refresh`,
    null,
    {
      headers: toPlainHeaders(headers),
    }
  );
};