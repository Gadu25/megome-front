import { authApi } from "@/lib/api/authApi";

export const verifyAccessToken = async (headers: Headers) => {
  const { verifyAccessToken } = authApi();
  await verifyAccessToken(headers);
}