import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();
    const formData = await req.formData();

    return await fetch(`${BACKEND_URL}/api/v1/experience/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error", experience: null },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();

    return await fetch(`${BACKEND_URL}/api/v1/experience/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error" },
      { status: 500 }
    );
  }
}
