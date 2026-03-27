import xior, { XiorRequestConfig, XiorError } from "xior";
import { authApi } from "./authApi";
import { isClientSide } from "@/functions/isClientSide";

const xiorClient = xior.create({
  withCredentials: true,
  cache: "no-store",
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void; config: XiorRequestConfig }> = [];

const processQueue = (error: XiorError | null) => {
  failedQueue.forEach((promise) => {
    if (!error) {
      promise.resolve(xiorClient.request(promise.config));
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
}

// Response interceptor for handling status 401
xiorClient.interceptors.response.use(
  (response) => response,
  async (error: XiorError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      isClientSide() &&
      !originalRequest?.url?.includes("/login") &&
      !error.response?.request.url.includes("/refresh")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { refreshAccessToken } = authApi();
          await refreshAccessToken();
          isRefreshing = false;
          processQueue(null);
          if (!originalRequest) {
            return Promise.reject(error);
          }
          return xiorClient.request(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError as XiorError);
          return Promise.reject(refreshError);
        }
      }
    }

    return new Promise((resolve, reject) => {
      if (originalRequest) {
        failedQueue.push({ resolve, reject, config: originalRequest });
      } else {
        reject(error);
      }
    })
  }
)

export default xiorClient;