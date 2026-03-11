import { apiFetch } from "./api"

export type LoginResponse = {
  'access-token': string;
  'message': string;
};

export type LoginPayload = {
  'email': string;
  'password': string;
}

export type LogoutResponse = {
  'message': string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout(): Promise<LogoutResponse> {
  return apiFetch<LoginResponse>("/api/v1/auth/logout", {
    method: "POST",
  })
}