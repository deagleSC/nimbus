// Common types used across stores

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface RequestStatus {
  isLoading: boolean;
  error: ApiError | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
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
