import type { Profile } from "@/types/domain";
import type { ProfilePayload } from "@/types/form";
import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface Response {
  message: string;
  profile: Profile;
}

export const updateProfileClient = async (profile: ProfilePayload) => {
  const formData = new FormData();

  formData.append("firstName", profile.firstName);
  formData.append("lastName", profile.lastName);
  formData.append("title", profile.title);
  formData.append("birthday", profile.birthday);
  formData.append("tagline", profile.tagline);
  formData.append("bio", profile.bio);
  formData.append("phone", profile.phone);
  formData.append("website", profile.website);
  formData.append("location", profile.location);

  if (profile.profileImage) {
    formData.append("profileImage", profile.profileImage);
  }

  const res = await fetchClient("/api/profile", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleResponse<Response>(res)
}

export const getProfileClient = async () => {
  const res = await fetchClient(
    "/api/profile",
    {
      method: "GET",
      credentials: "include",
    }
  )

  return handleResponse<Response>(res)
}
