import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError, ApiResponse } from "../types";
import { env } from "@/lib/env";

// Create axios instance with default config
const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Define a type for the potential error response data with the specific API format
    interface ErrorResponseData {
      success?: boolean;
      message?: string;
      [key: string]: unknown;
    }

    const errorData = error.response?.data as ErrorResponseData | undefined;
    const errorMessage = errorData?.message || error.message;

    const customError: ApiError = {
      message: errorMessage,
      status: error.response?.status,
    };

    // Handle specific error cases
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(customError);
  },
);

// Generic request function with error handling
export async function apiRequest<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse = await api(config);
    return {
      data: response.data,
      status: response.status,
      message: "Success",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Define a type for the potential error response data
      interface ErrorResponseData {
        success?: boolean;
        message?: string;
        [key: string]: unknown;
      }

      const errorData = error.response?.data as ErrorResponseData | undefined;
      const errorMessage = errorData?.message || error.message;

      throw {
        message: errorMessage,
        status: error.response?.status,
        code: error.code,
      } as ApiError;
    }

    // For non-Axios errors (should be rare)
    const finalMessage = (error as Error).message;

    throw {
      message: finalMessage,
    } as ApiError;
  }
}

// Helper methods for common request types
export const apiHelper = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ ...config, method: "GET", url });
  },

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ ...config, method: "POST", url, data });
  },

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ ...config, method: "PUT", url, data });
  },

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ ...config, method: "PATCH", url, data });
  },

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ ...config, method: "DELETE", url });
  },
};

export default api;
