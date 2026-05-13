import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(req: Request) {
  const requestId =
    req.headers.get("x-refresh-request-id") ??
    crypto.randomUUID();

  try {
    const cookieStore = await cookies();

    const incomingRefreshToken =
      cookieStore.get("refresh_token")?.value;

    if (!incomingRefreshToken) {
      return NextResponse.json(
        {
          message: "Missing refresh token",
        },
        {
          status: 401,
        },
      );
    }

    const backendResponse = await fetch(
      `${API_URL}/api/v1/auth/refresh`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${incomingRefreshToken}`,
        },
        cache: "no-store",
      },
    );

    const rawBody = await backendResponse.text();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message: "Refresh failed",
        },
        {
          status: 401,
        },
      );
    }

    const data = JSON.parse(rawBody);

    const response = NextResponse.json({
      success: true,
      accessToken: data.accessToken,
    });

    response.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set(
      "refresh_token",
      data.refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );

    return response;
  } catch (error) {
    console.error("[REFRESH] Route crash", {
      requestId,
      error,
    });

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}