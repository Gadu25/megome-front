import { NextFetchEvent, NextResponse, type NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

function isTokenExpired(token: string): boolean {
  try {
    // JWT is three base64url segments: header.payload.signature
    const payload = token.split(".")[1];
    if (!payload) return true;

    // base64url → base64 → JSON
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );

    if (!decoded.exp) return false; // no expiry claim — treat as valid

    // Add a 10s buffer so we refresh slightly before actual expiry
    return decoded.exp * 1000 < Date.now() + 10_000;
  } catch {
    return true;
  }
}

async function attemptRefresh(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    
    if (!res.ok) return null;

    const data = await res.json();

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch {
    return null;
  }
}

export function withAuth(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const pathname = request.nextUrl.pathname;

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const publicRoutes = ["/auth", "/"];
    const isProtectedRoute = !publicRoutes.some((r) =>
      r === "/" ? pathname === "/" : pathname.startsWith(r)
    );

    // Treat missing OR expired access token the same way
    const needsRefresh = !accessToken || isTokenExpired(accessToken);

    if (isProtectedRoute && needsRefresh) {
      if (!refreshToken) {
        return NextResponse.redirect(new URL("/auth", request.url));
      }

      const tokens = await attemptRefresh(refreshToken);

      if (!tokens) {
        const res = NextResponse.redirect(new URL("/auth", request.url));
        res.cookies.delete("refresh_token");
        return res;
      }

      // Redirect to the same URL — fresh cookies will be on the next request
      const destination = NextResponse.redirect(request.nextUrl);
      destination.cookies.set("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      destination.cookies.set("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return destination;
    }

    if (!isProtectedRoute && accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return middleware(request, event, response);
  };
}