export const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || "Something went wrong",
      data,
    };
  }

  return data;
}