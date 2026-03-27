import { authApi } from "@/lib/api/authApi";
import { NextResponse } from "next/server";
import { extractAndParseCookies } from "./extractAndParseCookies";
import { appendCookiesToNextResponse } from "./appendCookiesToNextResponse";

export const refreshAccessToken = async (response: NextResponse, headers: Headers) => {
  const { refreshAccessToken } = authApi();
  const refreshAccessTokenResponse = await refreshAccessToken(headers);
  const setCookieHeader = refreshAccessTokenResponse.headers.getSetCookie().join("; ");
  const refreshedAuthCookies = extractAndParseCookies(setCookieHeader, ["Authentication", "Refresh"]);
  const newResponse = appendCookiesToNextResponse(response, refreshedAuthCookies);
  return newResponse;
};
