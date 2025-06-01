"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { User } from "@/zustand/types";

// JWT token payload interface
interface JwtPayload {
  id: string;
  role: string;
  exp?: number;
  iat?: number;
}

// Auth context type with expanded properties
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  logout: async () => {},
  checkAuth: async () => false,
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
  const [hasMounted, setHasMounted] = useState(false);

  // Get authentication state and actions from store (separate selectors to prevent circular dependencies)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const logoutAction = useAuthStore((state) => state.logout);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check if token is valid and not expired
  const isTokenValid = useCallback(() => {
    try {
      // Only run on client side
      if (!hasMounted) return false;

      const token = localStorage.getItem("token");
      if (!token) return false;

      const decodedToken = jwtDecode<JwtPayload>(token);

      // Check if token has expiration and is not expired
      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      }

      return false;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  }, [hasMounted]);

  // Logout function that can be called from anywhere in the app
  const handleLogout = useCallback(async () => {
    if (!hasMounted) return;

    try {
      await logoutAction();

      // Immediately redirect to login, before any toast shows
      router.push("/auth/login");

      // Show success toast after redirect is initiated
      toast.success("Logged out", {
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to log out. Please try again.",
      });
    }
  }, [hasMounted, logoutAction, router]);

  // Function to check authentication status
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!hasMounted) return false;

    try {
      // Check if we have a token in localStorage
      if (!localStorage.getItem("token")) {
        return false;
      }

      // Check if token is valid and not expired
      if (!isTokenValid()) {
        // First, initiate redirect
        router.push("/auth/login");

        // Then show toast about session expiration
        toast.error("Session expired", {
          description: "Your session has expired. Please log in again.",
        });

        // Finally complete logout process in the background
        await logoutAction();
        return false;
      }

      // If we have a valid token but no user data, fetch user data
      if (!user) {
        await fetchCurrentUser().catch(() => {
          // If fetching user fails, consider auth failed
          return false;
        });
      }

      return isAuthenticated;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  }, [
    fetchCurrentUser,
    isAuthenticated,
    isTokenValid,
    user,
    hasMounted,
    router,
    logoutAction,
  ]);

  // Initialize authentication on component mount
  useEffect(() => {
    if (!hasMounted) return;

    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth, hasMounted]);

  // Setup interval to periodically check token validity (separated from initialization)
  useEffect(() => {
    if (!hasMounted) return;

    const authCheckInterval = setInterval(() => {
      if (!isTokenValid() && isAuthenticated) {
        // First initiate redirect, then show toast
        router.push("/auth/login");

        toast.error("Session expired", {
          description: "Your session has expired. Please log in again.",
        });

        // Handle logout in the background
        logoutAction().catch((error) => {
          console.error("Error during automatic logout:", error);
          toast.error("Logout error", {
            description:
              error instanceof Error
                ? error.message
                : "Failed to complete logout process. Please refresh the page.",
          });
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(authCheckInterval);
  }, [hasMounted, isAuthenticated, isTokenValid, router, logoutAction]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading || !hasMounted) return;

    // Handle redirects based on authentication status
    const isPublicRoute = publicRoutes.includes(pathname);
    const isRouteProtected = !isPublicRoute;

    // Handle base URL redirect
    if (pathname === "/") {
      if (isAuthenticated) {
        router.push("/dashboard/overview");
        return;
      } else {
        router.push("/auth/login");
        return;
      }
    }

    if (!isAuthenticated && isRouteProtected) {
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname);

      // Redirect to login
      router.push("/auth/login");
    } else if (isAuthenticated && pathname.startsWith("/auth")) {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/dashboard/overview");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, hasMounted]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isLoading: !hasMounted || isLoading, // Consider loading until mounted
      user,
      logout: handleLogout,
      checkAuth,
    }),
    [checkAuth, handleLogout, isAuthenticated, isLoading, user, hasMounted],
  );

  // Provide auth context to children
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
