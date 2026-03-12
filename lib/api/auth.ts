import { apiFetch } from "./api"
import { LoginResponse, LoginPayload, LogoutResponse } from "@/types/types";

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