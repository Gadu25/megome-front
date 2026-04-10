import { InitApi } from "@/lib/api/initApi";

export const getInit = async (headers: Headers) => {
  const { getInit } = InitApi();
  await getInit(headers);
}