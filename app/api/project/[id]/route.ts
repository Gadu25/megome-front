import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();
    const body = await req.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/project/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Failed to update project" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();

    const response = await fetch(`${BACKEND_URL}/api/v1/project/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Failed to delete project" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: err || "Internal server error" },
      { status: 500 }
    );
  }
}