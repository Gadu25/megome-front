import { XiorResponse } from "xior";
import xiorClient from "./xior";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
interface Profile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

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