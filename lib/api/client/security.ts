import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface MessageResponse {
  message: string;
}

interface SessionInfo {
  id: number;
  userId: number;
  expiresAt: string;
  createdAt: string;
}

interface SessionsResponse {
  sessions: SessionInfo[];
}

export const changePasswordClient = async (currentPassword: string, newPassword: string) => {
  const res = await fetchClient("/api/security/change-password", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse<MessageResponse>(res);
};

export const getSessionsClient = async () => {
  const res = await fetchClient("/api/security/sessions", {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<SessionsResponse>(res);
};

export const revokeSessionClient = async (id: number) => {
  const res = await fetchClient(`/api/security/sessions/${id}/revoke`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<MessageResponse>(res);
};
