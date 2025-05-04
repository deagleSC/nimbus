import { apiRequest } from "@/zustand/utils/api";
import { ApiResponse } from "@/zustand/types";
import { API_CONFIG } from "@/config/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    user: User;
  };
}

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
