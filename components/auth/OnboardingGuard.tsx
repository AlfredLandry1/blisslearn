"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useMemo, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";

interface OnboardingGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean; // true = redirige vers onboarding si pas complété, false = permet l'accès même si onboarding non complété
}

export function OnboardingGuard({ children, requireOnboarding = false }: OnboardingGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<{ completed: boolean; loading: boolean }>({ 
    completed: false, 
    loading: true 
  });

  const {
    get: getOnboardingStatus
  } = useApiClient<any>({
    onSuccess: (data) => {
      const completed = data?.data?.onboardingCompleted || false;
      console.log("📊 Statut onboarding depuis DB:", completed);
      setOnboardingStatus({ 
        completed, 
        loading: false 
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la vérification de l'onboarding:", error);
      setOnboardingStatus({ completed: false, loading: false });
    }
  });

  // Mémoriser les valeurs pour éviter les re-renders
  const isAuthenticated = useMemo(() => status === "authenticated", [status]);
  const isLoading = useMemo(() => status === "loading" || onboardingStatus.loading, [status, onboardingStatus.loading]);
  const isUnauthenticated = useMemo(() => status === "unauthenticated", [status]);

  // Vérifier le statut d'onboarding depuis la base de données
  useEffect(() => {
    if (isAuthenticated && session?.user?.email) {
      getOnboardingStatus('/api/onboarding');
    }
  }, [isAuthenticated, session?.user?.email]);

  // Nettoyer les timeouts
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Éviter les redirections multiples
    if (hasRedirected.current) {
      console.log("🚫 Redirection déjà effectuée, ignorée");
      return;
    }

    if (isLoading) {
      console.log("⏳ En attente du chargement...");
      return;
    }

    // Debug logs
    console.log("🔍 OnboardingGuard Debug:", {
      isAuthenticated,
      isLoading,
      isUnauthenticated,
      onboardingCompleted: onboardingStatus.completed,
      requireOnboarding,
      sessionUser: session?.user,
      hasRedirected: hasRedirected.current
    });

    if (isUnauthenticated) {
      console.log("🔐 Utilisateur non authentifié, redirection vers login");
      hasRedirected.current = true;
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && session?.user) {
      // Si requireOnboarding=true et onboarding non complété, rediriger vers onboarding
      if (requireOnboarding && !onboardingStatus.completed) {
        console.log("🔄 Redirection vers onboarding (requireOnboarding=true et onboarding non complété)");
        hasRedirected.current = true;
        
        // Ajouter un délai pour éviter les redirections trop rapides
        redirectTimeoutRef.current = setTimeout(() => {
          router.push("/onboarding");
        }, 100);
        return;
      }

      // Si on est sur la page onboarding et que l'onboarding est complété, rediriger vers dashboard
      if (!requireOnboarding && onboardingStatus.completed && window.location.pathname === "/onboarding") {
        console.log("✅ Onboarding complété, redirection vers dashboard");
        hasRedirected.current = true;
        
        // Ajouter un délai pour éviter les redirections trop rapides
        redirectTimeoutRef.current = setTimeout(() => {
          router.push("/dashboard");
        }, 100);
        return;
      }

      // Dans tous les autres cas, permettre l'accès
      console.log("✅ Accès autorisé");
      return;
    }
  }, [isAuthenticated, isLoading, isUnauthenticated, onboardingStatus.completed, requireOnboarding, router, session?.user]);

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