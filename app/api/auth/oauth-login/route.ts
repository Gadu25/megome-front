import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(req: Request) {
  const { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge } =
    await req.json();

  await setAuthCookies(accessToken, refreshToken, {
    accessTokenMaxAge,
    refreshTokenMaxAge,
  });

  return NextResponse.json({
    success: true,
  });
}