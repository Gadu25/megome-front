import { XiorResponse } from "xior";
import xiorClient from "./xior";
import type { Profile, ProfilePayload } from "@/types/types";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface Response {
  message: string;
  profile: Profile;
}

interface ProfileApi {
  updateProfile: (profile:ProfilePayload, headers?: Headers) => Promise<XiorResponse<Response>>;
}

export const profileApi = (): ProfileApi => {
  return {
    updateProfile,
  }
}

const updateProfile = (profile: ProfilePayload, headers?: Headers) => {
  console.log("Updating profile with data:", profile);
  const cookieHeader = headers?.get("cookie");
  const formData = new FormData();

  formData.append("firstName", profile.firstName);
  formData.append("lastName", profile.lastName);
  formData.append("bio", profile.bio);
  formData.append("phone", profile.phone);
  formData.append("website", profile.website);
  formData.append("location", profile.location);

  if (profile.profileImage) {
    formData.append("profileImage", profile.profileImage);
  }

  return xiorClient.post<Response>(
    `${BACKEND_URL}/api/v1/profile`,
    formData,
    {
      headers: {
        cookie: cookieHeader || "",
      },
    }
  );
};