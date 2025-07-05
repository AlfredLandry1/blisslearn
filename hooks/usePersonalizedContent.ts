import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { aiPersonalization } from '@/lib/ai-personalization';

interface PersonalizedContent {
  welcomeMessage: string;
  motivationQuote: string;
  dailyGoal: string;
  progressMessage: string;
  recommendationMessage: string;
  achievementMessage?: string;
  nextStepSuggestion: string;
}

interface UsePersonalizedContentReturn {
  content: PersonalizedContent | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePersonalizedContent(): UsePersonalizedContentReturn {
  const { data: session, status } = useSession();
  const [content, setContent] = useState<PersonalizedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Construire le profil utilisateur basique avec des valeurs par défaut
      const userProfile = {
        name: session.user.name || 'Utilisateur',
        email: session.user.email || '',
        onboardingCompleted: session.user.onboardingCompleted || false,
        totalCoursesStarted: (session.user as any).totalCoursesStarted || 0,
        totalCoursesCompleted: (session.user as any).totalCoursesCompleted || 0,
        totalTimeSpent: (session.user as any).totalTimeSpent || 0,
        totalCertifications: (session.user as any).totalCertifications || 0,
        streakDays: (session.user as any).streakDays || 0,
        lastActivityAt: (session.user as any).lastActivityAt,
        onboardingData: (session.user as any).onboardingData
      };

      const personalizedContent = await aiPersonalization.generatePersonalizedContent(userProfile);
      setContent(personalizedContent);
    } catch (err) {
      console.error('Erreur lors du chargement du contenu personnalisé:', err);
      setError('Impossible de charger le contenu personnalisé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'authenticated' && session?.user) {
      fetchContent();
    } else {
      setLoading(false);
    }
  }, [session, status]);

  const refresh = () => {
    fetchContent();
  };

  return {
    content,
    loading,
    error,
    refresh
  };
}

// Hook spécialisé pour les messages de bienvenue
export function useWelcomeMessage() {
  const { content, loading, error } = usePersonalizedContent();
  
  return {
    welcomeMessage: content?.welcomeMessage || 'Bienvenue !',
    loading,
    error
  };
}

// Hook spécialisé pour les citations de motivation
export function useMotivationContent() {
  const { content, loading, error } = usePersonalizedContent();
  
  return {
    motivationQuote: content?.motivationQuote || 'L\'apprentissage est un voyage passionnant !',
    dailyGoal: content?.dailyGoal || 'Objectif du jour : apprendre quelque chose de nouveau',
    loading,
    error
  };
}

// Hook spécialisé pour les messages de progression
export function useProgressMessage() {
  const { content, loading, error } = usePersonalizedContent();
  
  return {
    progressMessage: content?.progressMessage || 'Continuez votre apprentissage !',
    loading,
    error
  };
}

// Hook spécialisé pour les recommandations
export function useRecommendationMessage() {
  const { content, loading, error } = usePersonalizedContent();
  
  return {
    recommendationMessage: content?.recommendationMessage || 'Découvrez nos cours recommandés !',
    loading,
    error
  };
}

// Hook spécialisé pour les suggestions d'étapes suivantes
export function useNextStepSuggestion() {
  const { content, loading, error } = usePersonalizedContent();
  
  return {
    nextStepSuggestion: content?.nextStepSuggestion || 'Explorez de nouveaux cours !',
    loading,
    error
  };
}

// Hook spécialisé pour les messages d'achievement
export function useAchievementMessage() {
  const { content, loading, error } = usePersonalizedContent();
  
  return {
    achievementMessage: content?.achievementMessage,
    loading,
    error
  };
} 