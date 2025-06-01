import { apiRequest } from "@/zustand/utils/api.utils";
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  UserResponse,
} from "@/zustand/types";
import { API_CONFIG } from "@/config/api";

export const authService = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>({
      method: "POST",
      url: API_CONFIG.endpoints.auth.login,
      data: credentials,
    });
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return apiRequest<null>({
      method: "POST",
      url: API_CONFIG.endpoints.auth.logout,
    });
  },

  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    return apiRequest<UserResponse>({
      method: "GET",
      url: API_CONFIG.endpoints.auth.profile,
    });
  },
};
