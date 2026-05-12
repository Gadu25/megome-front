import { NextFetchEvent, NextResponse, type NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";
export function withAuth(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const pathname = request.nextUrl.pathname;

    const accessToken =
      request.cookies.get("access_token");

    const publicRoutes = ["/auth"];

    const isProtectedRoute = !publicRoutes.includes(pathname);

    if (isProtectedRoute && !accessToken) {
      return NextResponse.redirect(
        new URL("/auth", request.url)
      );
    }

    if (!isProtectedRoute && accessToken) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return middleware(request, event, response);
  };
}