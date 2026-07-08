import type { Profile } from "@/types/domain";
import { fetchWithAuth } from "./fetchWithAuth";
import { handleResponse } from "@/utils/api/handleResponse";

interface Response {
  success: boolean;
  profile: Profile;
}

export const getInitServer = async (): Promise<Response> => {
  const res = await fetchWithAuth("/api/v1/init");
  return handleResponse<Response>(res);
};