"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that ensures the user is authenticated
 * If not authenticated, redirects to the login page
 *
 * @example
 * // Use in a layout or page component
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <DashboardContent />
 *     </ProtectedRoute>
 *   );
 * }
 */
export function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const authCheckPerformed = useRef(false);

  // Handle client-side mounting
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // Skip if not yet mounted (prevents hydration mismatch)
    if (!hasMounted) return;

    // Skip if already authenticated or still loading auth state
    if (isAuthenticated || isLoading) {
      setIsChecking(false);
      return;
    }

    // Only perform the check once to prevent loops
    if (authCheckPerformed.current) {
      return;
    }

    const verifyAuth = async () => {
      try {
        authCheckPerformed.current = true;
        // Perform a fresh check of authentication status
        const authenticated = await checkAuth();

        if (!authenticated) {
          // Store the current URL to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== "/" && currentPath !== redirectTo) {
            sessionStorage.setItem("redirectAfterLogin", currentPath);
          }
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push(redirectTo);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth, hasMounted, isAuthenticated, isLoading, redirectTo, router]);

  // Don't render anything during SSR or until client-side mounting
  // This prevents hydration mismatch
  if (!hasMounted) {
    return null;
  }

  // Show loader while checking authentication on client side
  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
}
