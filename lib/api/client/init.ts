import type { Profile } from "@/types/domain";
import { handleResponse } from "@/utils/api/handleResponse";

interface Response {
  success: boolean;
  profile: Profile;
}

export const getInitClient = async (): Promise<Response> => {
  const res = await fetch(
    "/api/init",
    {
      method: "GET",
      credentials: "include"
    }
  );

  return handleResponse<Response>(res);
};