import { NextResponse } from "next/server";
import {
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 }
    );
  }

  const data = await res.json();

  await setAuthCookies(
    data.accessToken,
    data.refreshToken
  );

  return NextResponse.json({ success: true });
}