import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accesToken = await getAccessToken();

    const response = await fetch(
      `${BACKEND_URL}/api/v1/technology`,
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
          message: "Failed to fetch technologies",
          technologies: [],
        }
      )
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
       {
        message: err,
        technologies: [],
       }
    )
  }
}