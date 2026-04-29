import { XiorResponse } from "xior"

export async function withRequest<TResponse>(
  request: () => Promise<XiorResponse<TResponse>>,
  showToast: (msg: string, type: "success" | "error") => void
): Promise<TResponse | null> {
  try {
    const res = await request()

    if ((res.data as any)?.message) {
      showToast((res.data as any).message, "success")
    }

    return res.data
  } catch (err: any) {
    showToast(
      err?.response?.data?.error || "Unexpected error",
      "error"
    )
    return null
  }
}