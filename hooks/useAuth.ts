"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = async (email: string, password: string) => {
    try {
      // Récupère le callbackUrl de la query string, sinon /dashboard
      const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      // Redirige vers l'URL retournée par NextAuth (comme pour Google)
      if (result?.url) {
        router.push(result.url);
      } else {
        router.push("/dashboard");
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: "Une erreur est survenue" };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
} 