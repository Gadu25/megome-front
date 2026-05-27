import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accesToken = await getAccessToken();

    return await fetch(
      `${BACKEND_URL}/api/v1/pat`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accesToken}`,
        }
      }
    )
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

    return await fetch(`${BACKEND_URL}/api/v1/pat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
  } catch (_) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}