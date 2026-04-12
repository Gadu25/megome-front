import { XiorResponse } from "xior";
import xiorClient from "./xior";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  success: boolean;
}

interface AuthApi {
  login: (email: string, password: string) => Promise<XiorResponse<Response>>;
  register: (email: string, password: string) => Promise<XiorResponse<Response>>;
  logout: (headers?: Headers) => Promise<XiorResponse<Response>>;
  verifyAccessToken: (headers?: Headers) => Promise<XiorResponse<Response>>;
  refreshAccessToken: (headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const authApi = (): AuthApi => {
  return {
    login,
    register,
    logout,
    verifyAccessToken,
    refreshAccessToken,
  };
};

const login = (email: string, password: string) => {
  return xiorClient.post<Response>(`${BACKEND_URL}/api/v1/auth/login`, { email, password });
};

const register = (email: string, password: string) => {
  return xiorClient.post<Response>(`${BACKEND_URL}/api/v1/auth/register`, { email, password });
}

const logout = (headers?: Headers) => {
  return xiorClient.post<Response>(`${BACKEND_URL}/api/v1/auth/logout`, { headers });
};

const verifyAccessToken = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  return xiorClient.get<Response>(
    `${BACKEND_URL}/api/v1/auth/verify`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
};

const refreshAccessToken = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  return xiorClient.get<Response>(
    `${BACKEND_URL}/api/v1/auth/refresh`,
    {
      headers: {
        cookie: cookieHeader || "",
      }
    }
  );
}
