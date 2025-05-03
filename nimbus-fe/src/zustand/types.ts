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
