import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface MessageResponse {
  message: string;
}

export const changeEmailClient = async (email: string, currentPassword: string) => {
  const res = await fetchClient("/api/account/change-email", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, currentPassword }),
  });
  return handleResponse<MessageResponse>(res);
};

export const changeUsernameClient = async (username: string) => {
  const res = await fetchClient("/api/account/change-username", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return handleResponse<MessageResponse>(res);
};

export const deleteAccountClient = async (password: string) => {
  const res = await fetchClient("/api/account/delete", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return handleResponse<MessageResponse>(res);
};
