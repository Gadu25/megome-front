import { NextResponse } from "next/server";
import { authApi } from "@/lib/api/authApi";
import { appendCookiesToNextResponse } from "./appendCookiesToNextResponse";
import { extractAndParseCookies } from "./extractAndParseCookies";

export const logout = async (response: NextResponse, headers: Headers) => {
  const { logout } = authApi();
  const refreshAccessTokenResponse = await logout(headers);
  const setCookieHeader = refreshAccessTokenResponse.headers.getSetCookie().join("; ");
  const removedAuthCookies = extractAndParseCookies(setCookieHeader, ["Authentication", "Refresh"]);
  const newResponse = appendCookiesToNextResponse(response, removedAuthCookies);
  return newResponse;
};