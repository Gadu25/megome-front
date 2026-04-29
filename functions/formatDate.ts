export const formatDate = (value?: string | null) => {
  if (!value) return "";

  return value?.split("T")[0];
}