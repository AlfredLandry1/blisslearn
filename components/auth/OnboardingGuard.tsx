"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useMemo } from "react";

interface OnboardingGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean; // true = redirige vers onboarding si pas complété, false = permet l'accès même si onboarding non complété
}

export function OnboardingGuard({ children, requireOnboarding = false }: OnboardingGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Mémoriser les valeurs pour éviter les re-renders
  const isAuthenticated = useMemo(() => status === "authenticated", [status]);
  const isLoading = useMemo(() => status === "loading", [status]);
  const isUnauthenticated = useMemo(() => status === "unauthenticated", [status]);
  const hasCompletedOnboarding = useMemo(() => session?.user?.onboardingCompleted ?? false, [session?.user?.onboardingCompleted]);

  useEffect(() => {
    // Éviter les redirections multiples
    if (hasRedirected.current) return;

    if (isLoading) return;

    // Debug logs
    console.log("🔍 OnboardingGuard Debug:", {
      isAuthenticated,
      isLoading,
      isUnauthenticated,
      hasCompletedOnboarding,
      requireOnboarding,
      sessionUser: session?.user,
      sessionOnboardingCompleted: session?.user?.onboardingCompleted
    });

    if (isUnauthenticated) {
      hasRedirected.current = true;
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && session?.user) {
      // Si requireOnboarding=true et onboarding non complété, rediriger vers onboarding
      if (requireOnboarding && !hasCompletedOnboarding) {
        console.log("🔄 Redirection vers onboarding (requireOnboarding=true et onboarding non complété)");
        hasRedirected.current = true;
        router.push("/onboarding");
        return;
      }

      // Dans tous les autres cas, permettre l'accès
      console.log("✅ Accès autorisé");
      return;
    }
  }, [isAuthenticated, isLoading, isUnauthenticated, hasCompletedOnboarding, requireOnboarding, router, session?.user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isUnauthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 