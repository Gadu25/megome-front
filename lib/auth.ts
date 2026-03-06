import { apiFetch } from "./api"

export type LoginResponse = {
  'access-token': string;
  'message': string;
};

export type LoginPayload = {
  'email': string;
  'password': string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/v1/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}