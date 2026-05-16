import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();
    const formData = await req.formData();

    console.log("accessToken", accessToken)
    const response = await fetch(`${BACKEND_URL}/api/v1/project/${id}/cover`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Failed to upload cover", image: null },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error", image: null },
      { status: 500 }
    );
  }
}