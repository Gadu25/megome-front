import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    return await fetch(
      `${BACKEND_URL}/api/v1/init`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err || "Internal server error",
      },
      { status: 500 }
    );
  }
}