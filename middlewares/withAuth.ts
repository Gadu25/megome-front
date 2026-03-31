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

    const publicRoutes = ["/auth"]

    const isProtectedRoute = (pathname: string) => !publicRoutes.includes(pathname);

    if (isProtectedRoute(pathname) && !accessToken) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (!isProtectedRoute(pathname) && accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    try {
      if (isProtectedRoute(pathname) && accessToken) {
        await verifyAccessToken(headers);
      }
    } catch (_) {
      try {
        response = await refreshAccessToken(response, headers);
      } catch (_) {
        response = await logout(response, headers);
      }
    }

    return middleware(request, event, response);
  };
}