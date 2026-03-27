import { NextFetchEvent, NextResponse, type NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";
import { createAuthHeaders } from "@/functions/createAuthHeaders";
import { verifyAccessToken } from "@/functions/verifyAccessToken";
import { refreshAccessToken } from "@/functions/refreshAccessToken";
import { logout } from "@/functions/logout";

export function withAuth(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("Authentication");
    const refreshToken = request.cookies.get("refresh_token");
    const headers = createAuthHeaders(request.headers, { accessToken, refreshToken });
    console.log("withAuth")
    const isProtectedRoute = (pathname: string) => pathname.includes("/protected");
    console.log("pathname", pathname)
    console.log("accessToken", accessToken)
    console.log("refreshToken", refreshToken)
    console.log("headers", headers)
    console.log("isProtectedRoute", isProtectedRoute(pathname))

    if (isProtectedRoute(pathname) && !accessToken) {
      console.log('FIRST')
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (!isProtectedRoute(pathname) && accessToken) {
      return NextResponse.redirect(new URL("/protected/server", request.url));
    }

    try {
      if (isProtectedRoute(pathname) && accessToken) {
        const res = await verifyAccessToken(headers);
        console.log('done await verifyaccess', res)
      }
    } catch (err) {
      console.log('catched', err)
      try {
        response = await refreshAccessToken(response, headers);
      } catch (_) {
        response = await logout(response, headers);
      }
    }

    return middleware(request, event, response);
  };
}