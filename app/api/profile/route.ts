import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    return await fetch(
      `${BACKEND_URL}/api/v1/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: err,
        profile: null,
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    const accessToken = await getAccessToken();
    const formData = await req.formData();

    return await fetch(`${BACKEND_URL}/api/v1/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error", profile: null },
      { status: 500 }
    );
  }
}