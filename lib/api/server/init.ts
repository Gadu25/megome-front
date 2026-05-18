import type { Profile } from "@/types/types";
import { fetchWithAuth } from "./fetchWithAuth";
import { handleResponse } from "@/functions/handleResponse";

interface Response {
  success: boolean;
  profile: Profile;
}

export const getInitServer = async (): Promise<Response> => {
  const res = await fetchWithAuth("/api/v1/init");
  return handleResponse<Response>(res);
};