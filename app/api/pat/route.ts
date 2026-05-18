import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accesToken = await getAccessToken();

    const response = await fetch(
      `${BACKEND_URL}/api/v1/pat`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accesToken}`,
        }
      }
    )

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch Personal Access Tokens",
          pats: [],
        }
      )
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
       {
        message: err,
        pats: [],
       }
    )
  }
}

export async function POST(req: Request) {
  try {
    const accessToken = await getAccessToken();
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/pat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Failed to add Personal Access Token" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}