import { XiorError } from "xior";

export const isUnauthorizedError = (error: unknown): boolean => {
  return error instanceof XiorError && error.response?.status === 401;
}
