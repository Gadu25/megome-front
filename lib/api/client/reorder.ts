import { handleResponse } from "@/utils/api/handleResponse";
import { fetchClient } from "./fetchClient";

interface ReorderResponse {
  message: string;
}

interface ReorderItem {
  id: number;
  displayOrder: number;
}

export const reorderClient = async (
  resource: "experience" | "certification" | "education" | "project",
  items: ReorderItem[]
): Promise<ReorderResponse> => {
  const res = await fetchClient(
    `/api/${resource}/reorder`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    }
  );

  return handleResponse<ReorderResponse>(res);
};
