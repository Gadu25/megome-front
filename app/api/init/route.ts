import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: Request) {
  try {
    const rawCookie = req.headers.get("cookie");
    const parsed = parseCookies(rawCookie);
    const accessToken = parsed["access_token"];

    const response = await fetch(`${BACKEND_URL}/api/v1/init`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch init",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, ...v] = cookie.trim().split("=");
    if (!key) return acc;

    acc[key] = decodeURIComponent(v.join("="));
    return acc;
  }, {} as Record<string, string>);
}