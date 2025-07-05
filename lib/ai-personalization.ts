import { OnboardingData } from "@/components/onboarding/types";

interface UserProfile {
  name: string;
  email: string;
  onboardingData?: OnboardingData;
  onboardingCompleted: boolean;
  totalCoursesStarted: number;
  totalCoursesCompleted: number;
  totalTimeSpent: number;
  totalCertifications: number;
  streakDays: number;
  lastActivityAt?: Date;
}

interface PersonalizedContent {
  welcomeMessage: string;
  motivationQuote: string;
  dailyGoal: string;
  progressMessage: string;
  recommendationMessage: string;
  achievementMessage?: string;
  nextStepSuggestion: string;
}

export class AIPersonalizationService {
  private static instance: AIPersonalizationService;
  
  private constructor() {}
  
  static getInstance(): AIPersonalizationService {
    if (!AIPersonalizationService.instance) {
      AIPersonalizationService.instance = new AIPersonalizationService();
    }
    return AIPersonalizationService.instance;
  }

  async generatePersonalizedContent(user: UserProfile): Promise<PersonalizedContent> {
    const context = this.buildUserContext(user);
    
    try {
      const response = await fetch('/api/ai/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, context }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du contenu personnalisé');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur IA:', error);
      return this.getFallbackContent(user);
    }
  }

  private buildUserContext(user: UserProfile): string {
    const onboarding = user.onboardingData;
    const isActive = user.streakDays > 0;
    const isNewUser = user.totalCoursesCompleted === 0;
    const isExperienced = user.totalCoursesCompleted > 5;

    let context = `Utilisateur: ${user.name}\n`;
    context += `Niveau d'activité: ${isActive ? 'Actif' : 'Nouveau'}\n`;
    context += `Expérience: ${isNewUser ? 'Débutant' : isExperienced ? 'Expérimenté' : 'Intermédiaire'}\n`;
    
    if (onboarding) {
      context += `Objectifs: ${onboarding.learningObjectives?.join(', ') || 'Non définis'}\n`;
      context += `Domaines: ${onboarding.domainsOfInterest?.join(', ') || 'Non définis'}\n`;
      context += `Niveau: ${onboarding.skillLevel || 'Non défini'}\n`;
      context += `Disponibilité: ${onboarding.weeklyHours || 0}h/semaine\n`;
    }

    context += `Statistiques: ${user.totalCoursesCompleted} cours terminés, ${user.totalCertifications} certifications, ${user.streakDays} jours de suite\n`;
    
    return context;
  }

  private getFallbackContent(user: UserProfile): PersonalizedContent {
    const onboarding = user.onboardingData;
    const isNewUser = user.totalCoursesCompleted === 0;
    const isActive = user.streakDays > 0;

    const welcomeMessage = isNewUser 
      ? `Bienvenue ${user.name} ! Prêt à commencer votre voyage d'apprentissage ?`
      : `Bon retour ${user.name} ! Continuons votre progression.`;

    const motivationQuote = this.getMotivationalQuote(onboarding?.skillLevel || 'beginner');

    const dailyGoal = this.getDailyGoal(onboarding?.weeklyHours || 0, onboarding?.skillLevel || 'beginner');

    const progressMessage = isNewUser
      ? "Commencez par explorer nos cours recommandés pour vous."
      : `Excellent travail ! Vous avez terminé ${user.totalCoursesCompleted} cours.`;

    const recommendationMessage = this.getRecommendationMessage(onboarding);

    const nextStepSuggestion = this.getNextStepSuggestion(user, onboarding);

    return {
      welcomeMessage,
      motivationQuote,
      dailyGoal,
      progressMessage,
      recommendationMessage,
      nextStepSuggestion
    };
  }

  private getMotivationalQuote(skillLevel: string): string {
    const quotes = {
      beginner: [
        "Chaque expert était un jour un débutant. Votre voyage commence maintenant !",
        "L'apprentissage est un voyage, pas une destination. Profitez de chaque étape !",
        "La curiosité est le moteur de l'apprentissage. Gardez-la vivante !"
      ],
      intermediate: [
        "Vous construisez une base solide. Continuez à explorer et à grandir !",
        "L'expertise se développe jour après jour. Vous êtes sur la bonne voie !",
        "Chaque nouveau concept maîtrisé vous rapproche de vos objectifs !"
      ],
      advanced: [
        "Votre expertise inspire les autres. Partagez votre savoir !",
        "L'excellence est un choix quotidien. Vous l'avez fait !",
        "Vous êtes un exemple de persévérance et de dévouement !"
      ]
    };

    const levelQuotes = quotes[skillLevel as keyof typeof quotes] || quotes.beginner;
    return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
  }

  private getDailyGoal(weeklyHours: number, skillLevel: string): string {
    const dailyMinutes = Math.round((weeklyHours * 60) / 7);
    
    if (dailyMinutes < 15) {
      return "Objectif du jour : 15 minutes d'apprentissage";
    } else if (dailyMinutes < 30) {
      return `Objectif du jour : ${dailyMinutes} minutes d'apprentissage`;
    } else {
      return `Objectif du jour : ${dailyMinutes} minutes d'apprentissage intensif`;
    }
  }

  private getRecommendationMessage(onboarding?: OnboardingData): string {
    if (!onboarding) {
      return "Découvrez nos cours populaires pour commencer votre apprentissage.";
    }

    const objectives = onboarding.learningObjectives || [];
    const domains = onboarding.domainsOfInterest || [];

    if (objectives.length > 0 && domains.length > 0) {
      return `Basé sur vos objectifs (${objectives[0]}) et vos domaines d'intérêt (${domains[0]}), nous avons sélectionné des cours parfaits pour vous.`;
    } else if (objectives.length > 0) {
      return `Pour atteindre votre objectif "${objectives[0]}", voici nos meilleures recommandations.`;
    } else if (domains.length > 0) {
      return `Dans le domaine "${domains[0]}", nous avons des cours qui correspondent parfaitement à votre niveau.`;
    }

    return "Découvrez nos cours recommandés basés sur votre profil d'apprentissage.";
  }

  private getNextStepSuggestion(user: UserProfile, onboarding?: OnboardingData): string {
    if (!user.onboardingCompleted) {
      return "Complétez votre onboarding pour recevoir des recommandations personnalisées !";
    }

    if (user.totalCoursesCompleted === 0) {
      return "Commencez par un cours de votre domaine d'intérêt pour prendre de l'élan !";
    }

    if (user.streakDays === 0) {
      return "Reprenez votre rythme d'apprentissage avec un cours court et engageant !";
    }

    if (user.totalCertifications === 0) {
      return "Obtenez votre première certification pour marquer votre progression !";
    }

    return "Continuez sur votre lancée avec un cours plus avancé dans votre domaine !";
  }

  // Méthodes spécialisées pour différents composants
  async getDashboardWelcome(user: UserProfile): Promise<string> {
    const content = await this.generatePersonalizedContent(user);
    return content.welcomeMessage;
  }

  async getMotivationCard(user: UserProfile): Promise<{ quote: string; goal: string }> {
    const content = await this.generatePersonalizedContent(user);
    return {
      quote: content.motivationQuote,
      goal: content.dailyGoal
    };
  }

  async getProgressMessage(user: UserProfile): Promise<string> {
    const content = await this.generatePersonalizedContent(user);
    return content.progressMessage;
  }

  async getRecommendationIntro(user: UserProfile): Promise<string> {
    const content = await this.generatePersonalizedContent(user);
    return content.recommendationMessage;
  }
}

// Export d'une instance singleton
export const aiPersonalization = AIPersonalizationService.getInstance(); 