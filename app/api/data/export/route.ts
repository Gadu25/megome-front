import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${BACKEND_URL}/api/v1/data/export`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Content-Disposition": "attachment; filename=megome-export.json",
      },
    });
  } catch (_) {
    return NextResponse.json({ message: "Export failed" }, { status: 500 });
  }
}
