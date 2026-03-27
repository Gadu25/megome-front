import { authApi } from "@/lib/api/authApi";

export const verifyAccessToken = async (headers: Headers) => {
  console.log('verifying')
  const { verifyAccessToken } = authApi();
  await verifyAccessToken(headers);
}