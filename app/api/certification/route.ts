import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accesToken = await getAccessToken();

    return await fetch(
      `${BACKEND_URL}/api/v1/certification`,
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
        certificates: [],
       }
    )
  }
}

export async function POST(req: Request) {
  try {
    const accessToken = await getAccessToken();
    const formData = await req.formData();

    return await fetch(`${BACKEND_URL}/api/v1/certification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
  } catch (_) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}