import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    return await fetch(
      `${BACKEND_URL}/api/v1/dashboard/overview`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: err,
        data: null,
      }
    )
  }
}