import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${BACKEND_URL}/api/v1/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch profile",
          profile: null
        }
      )
    }

    return NextResponse.json(data);
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

    const response = await fetch(`${BACKEND_URL}/api/v1/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Failed to update profile", profile: null },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error", profile: null },
      { status: 500 }
    );
  }
}