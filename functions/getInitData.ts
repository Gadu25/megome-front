import { InitApi } from "@/lib/api/client/init";

export const getInit = async (headers: Headers) => {
  const { getInit } = InitApi();
  await getInit(headers);
}