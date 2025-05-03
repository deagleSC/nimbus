"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/zustand";

// Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

// Public routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/legal/privacy",
  "/legal/terms",
];

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Get authentication state from store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // If we have a token but no user data, try to fetch user data
        if (isAuthenticated || localStorage.getItem("token")) {
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchCurrentUser, isAuthenticated]);

  useEffect(() => {
    if (!isLoading) {
      // Handle redirects based on authentication status
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!isAuthenticated && !isPublicRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push("/auth/login");
      } else if (isAuthenticated && pathname.startsWith("/auth")) {
        // Redirect to dashboard if authenticated and trying to access auth routes
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  // Provide loading state and auth info to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
