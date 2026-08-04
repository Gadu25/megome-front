import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function DELETE(req: Request) {
  try {
    const accessToken = await getAccessToken();
    const body = await req.json();

    return await fetch(`${BACKEND_URL}/api/v1/auth/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
  } catch (_) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
