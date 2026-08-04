import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accessToken = await getAccessToken();
    const { id } = await params;

    return await fetch(`${BACKEND_URL}/api/v1/auth/sessions/${id}/revoke`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (_) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
