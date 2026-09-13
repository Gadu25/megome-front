import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type AuthCookieOptions = {
  accessTokenMaxAge?: number;
  refreshTokenMaxAge?: number;
};

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  options: AuthCookieOptions = {}
) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: options.accessTokenMaxAge,
  });

  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: options.refreshTokenMaxAge,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_TOKEN_KEY)?.value;
}