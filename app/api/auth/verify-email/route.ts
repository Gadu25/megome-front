import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${BACKEND_URL}/api/v1/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.error || "Verification failed",
        },
        {
          status: response.status,
        }
      );
    }

    await setAuthCookies(data.accessToken, data.refreshToken, {
      accessTokenMaxAge: data.accessTokenMaxAge,
      refreshTokenMaxAge: data.refreshTokenMaxAge,
    });

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (_) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
