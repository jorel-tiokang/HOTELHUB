"use client";

/**
 * AuthGuard.tsx
 *
 * Wraps any dashboard page to enforce authentication and role-based access.
 *
 * Usage:
 *   <AuthGuard requiredRole="CLIENT">
 *     <ClientDashboard />
 *   </AuthGuard>
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthStore, type Role } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Still hydrating from localStorage — wait
    if (isLoading) return;

    // Not logged in → redirect to login
    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/login`);
      return;
    }

    // Logged in but wrong role → redirect to their own dashboard
    if (requiredRole && user.role !== requiredRole) {
      const { getRedirectPath } = useAuthStore.getState();
      router.replace(getRedirectPath(locale));
    }
  }, [isAuthenticated, user, isLoading, requiredRole, locale, router]);

  // While checking, render nothing (a skeleton could go here later)
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
