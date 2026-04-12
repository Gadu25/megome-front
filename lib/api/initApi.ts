import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Profile } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  success: boolean;
  profile: Profile;
}

interface InitApi {
  getInit: (headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const InitApi = (): InitApi => {
  return {
    getInit,
  }
}

const getInit = (headers?: Headers) => {
  const cookieHeader = headers?.get("cookie");
  return xiorClient.get<Response>(
    `${BACKEND_URL}/api/v1/init`,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
};