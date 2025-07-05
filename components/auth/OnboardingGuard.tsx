"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useMemo } from "react";

interface OnboardingGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean; // true = redirige vers onboarding si pas complété, false = redirige vers onboarding si pas complété, mais ne redirige PAS vers dashboard si complété
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
      // Si l'onboarding n'est pas complété, rediriger vers onboarding (peu importe requireOnboarding)
      if (!hasCompletedOnboarding) {
        console.log("🔄 Redirection vers onboarding (onboarding non complété)");
        hasRedirected.current = true;
        router.push("/onboarding");
        return;
      }

      // Si requireOnboarding=true et onboarding complété, rediriger vers dashboard
      // (pour les pages qui nécessitent l'onboarding mais ne sont pas le dashboard)
      if (requireOnboarding && hasCompletedOnboarding) {
        console.log("🔄 Redirection vers dashboard (requireOnboarding=true et onboarding complété)");
        hasRedirected.current = true;
        router.push("/dashboard");
        return;
      }

      // Si requireOnboarding=false et onboarding complété, NE PAS rediriger
      // (pour les pages comme my-courses, explorer, etc.)
      if (!requireOnboarding && hasCompletedOnboarding) {
        console.log("✅ Accès autorisé (requireOnboarding=false et onboarding complété)");
        return;
      }
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