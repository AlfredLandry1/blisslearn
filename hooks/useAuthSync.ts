import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';

export function useAuthSync() {
  const { data: session, status } = useSession();
  const { setSession, setLoading, updateOnboardingStatus } = useUserStore();

  useEffect(() => {
    // Synchroniser la session avec le store
    setSession(session);
    setLoading(status === 'loading');
  }, [session, status, setSession, setLoading]);

  // Fonction pour mettre à jour le statut d'onboarding
  const updateOnboarding = (completed: boolean) => {
    updateOnboardingStatus(completed);
  };

  return {
    session,
    status,
    updateOnboarding,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading'
  };
} 