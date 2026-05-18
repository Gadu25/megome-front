import type { Profile } from "@/types/types";
import { handleResponse } from "@/functions/handleResponse";

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