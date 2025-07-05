import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { OnboardingData } from "@/components/onboarding/types";
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// Cache simple pour éviter les appels répétés
const contentCache = new Map<string, { content: PersonalizedContent; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { user, context } = await request.json();

    // Vérifier le cache d'abord
    const cacheKey = `${session.user.email}-${Date.now() - (Date.now() % (5 * 60 * 1000))}`; // Cache par 5 minutes
    const cached = contentCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log("✅ Contenu récupéré depuis le cache");
      return NextResponse.json(cached.content);
    }

    // Récupérer les données complètes de l'utilisateur depuis la base
    const userData = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        onboardingResponses: true
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Construire le profil utilisateur complet
    const userProfile: UserProfile = {
      name: userData.name || "Utilisateur",
      email: userData.email,
      onboardingCompleted: userData.onboardingCompleted,
      totalCoursesStarted: userData.totalCoursesStarted,
      totalCoursesCompleted: userData.totalCoursesCompleted,
      totalTimeSpent: userData.totalTimeSpent,
      totalCertifications: userData.totalCertifications,
      streakDays: userData.streakDays,
      lastActivityAt: userData.lastActivityAt || undefined,
      onboardingData: userData.onboardingResponses?.[0] ? {
        learningObjectives: JSON.parse(userData.onboardingResponses[0].learningObjectives || "[]"),
        domainsOfInterest: JSON.parse(userData.onboardingResponses[0].domainsOfInterest || "[]"),
        skillLevel: userData.onboardingResponses[0].skillLevel,
        weeklyHours: userData.onboardingResponses[0].weeklyHours,
        preferredPlatforms: JSON.parse(userData.onboardingResponses[0].preferredPlatforms || "[]"),
        coursePreferences: {
          format: JSON.parse(userData.onboardingResponses[0].courseFormat || "[]"),
          duration: userData.onboardingResponses[0].courseDuration,
          language: userData.onboardingResponses[0].courseLanguage
        }
      } : undefined
    };

    // Essayer d'abord avec Gemini, puis fallback sur le système actuel
    let personalizedContent: PersonalizedContent;
    
    try {
      personalizedContent = await generateContentWithGemini(userProfile);
      console.log("✅ Contenu généré avec Gemini");
    } catch (geminiError) {
      console.warn("⚠️ Erreur Gemini, utilisation du fallback:", geminiError);
      personalizedContent = await generatePersonalizedContent(userProfile);
      console.log("✅ Contenu généré avec le système de fallback");
    }

    // Mettre en cache le contenu
    contentCache.set(cacheKey, { content: personalizedContent, timestamp: Date.now() });

    return NextResponse.json(personalizedContent);

  } catch (error) {
    console.error("Erreur lors de la personnalisation IA:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

async function generateContentWithGemini(user: UserProfile): Promise<PersonalizedContent> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Tu es BlissLearn, une plateforme d'apprentissage en ligne. Génère du contenu personnalisé et motivant pour un utilisateur.

**Profil de l'utilisateur :**
- Nom : ${user.name}
- Email : ${user.email}
- Onboarding complété : ${user.onboardingCompleted ? "Oui" : "Non"}
- Cours commencés : ${user.totalCoursesStarted}
- Cours terminés : ${user.totalCoursesCompleted}
- Temps total passé : ${user.totalTimeSpent} minutes
- Certifications obtenues : ${user.totalCertifications}
- Jours consécutifs : ${user.streakDays}
- Dernière activité : ${user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString('fr-FR') : "Jamais"}

${user.onboardingData ? `
**Données d'onboarding :**
- Objectifs d'apprentissage : ${user.onboardingData.learningObjectives.join(', ')}
- Domaines d'intérêt : ${user.onboardingData.domainsOfInterest.join(', ')}
- Niveau de compétence : ${user.onboardingData.skillLevel}
- Heures par semaine : ${user.onboardingData.weeklyHours}
- Plateformes préférées : ${user.onboardingData.preferredPlatforms.join(', ')}
- Format de cours : ${user.onboardingData.coursePreferences.format.join(', ')}
- Durée de cours : ${user.onboardingData.coursePreferences.duration}
- Langue : ${user.onboardingData.coursePreferences.language}
` : "Aucune donnée d'onboarding disponible"}

**Tâche :** Génère du contenu personnalisé et motivant. Réponds UNIQUEMENT au format JSON suivant, sans texte avant ou après, sans backticks :

{
  "welcomeMessage": "Message de bienvenue personnalisé et chaleureux",
  "motivationQuote": "Citation motivante adaptée au profil et aux objectifs",
  "dailyGoal": "Objectif quotidien personnalisé basé sur les heures par semaine",
  "progressMessage": "Message sur la progression actuelle, encourageant",
  "recommendationMessage": "Message pour les recommandations de cours",
  "achievementMessage": "Message de félicitations si applicable (null si pas d'achievement)",
  "nextStepSuggestion": "Suggestion d'étape suivante personnalisée"
}

**Règles :**
- Utilise un ton encourageant, bienveillant et personnalisé
- Adapte le contenu au niveau de compétence et aux objectifs
- Sois spécifique et concret
- Évite les généralités
- Utilise le prénom de l'utilisateur
- Si l'utilisateur n'a pas complété l'onboarding, encourage-le à le faire
- Si c'est un nouveau utilisateur, sois plus accueillant
- Si c'est un utilisateur expérimenté, reconnais ses accomplissements
- IMPORTANT : Réponds UNIQUEMENT en JSON pur, sans backticks ni markdown
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Nettoyer la réponse pour enlever les backticks et markdown
    let cleanText = text.trim();
    
    // Enlever les backticks de markdown
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '');
    }
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '');
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.replace(/\s*```$/, '');
    }
    
    // Enlever les espaces et retours à la ligne en début/fin
    cleanText = cleanText.trim();
    
    const parsed = JSON.parse(cleanText);
    return {
      welcomeMessage: parsed.welcomeMessage || "Bienvenue sur BlissLearn !",
      motivationQuote: parsed.motivationQuote || "Votre apprentissage est un voyage vers l'excellence !",
      dailyGoal: parsed.dailyGoal || "Objectif du jour : 15 minutes d'apprentissage !",
      progressMessage: parsed.progressMessage || "Continuez sur votre lancée !",
      recommendationMessage: parsed.recommendationMessage || "Découvrez nos cours recommandés !",
      achievementMessage: parsed.achievementMessage || undefined,
      nextStepSuggestion: parsed.nextStepSuggestion || "Explorez de nouveaux domaines !"
    };
  } catch (parseError) {
    console.error("Erreur parsing JSON Gemini:", parseError);
    console.error("Texte reçu de Gemini:", text);
    throw new Error("Réponse Gemini invalide");
  }
}

async function generatePersonalizedContent(user: UserProfile): Promise<PersonalizedContent> {
  const onboarding = user.onboardingData;
  const isNewUser = user.totalCoursesCompleted === 0;
  const isActive = user.streakDays > 0;
  const isExperienced = user.totalCoursesCompleted > 5;

  // Messages de bienvenue personnalisés
  const welcomeMessages = {
    newUser: [
      `Bienvenue ${user.name} ! Prêt à transformer vos objectifs en réalité ?`,
      `Salut ${user.name} ! Votre voyage d'apprentissage commence maintenant.`,
      `Ravi de vous accueillir ${user.name} ! Ensemble, nous allons atteindre vos objectifs.`
    ],
    returning: [
      `Bon retour ${user.name} ! Continuons votre progression vers l'excellence.`,
      `Ravi de vous revoir ${user.name} ! Prêt pour une nouvelle session d'apprentissage ?`,
      `Bienvenue ${user.name} ! Votre persévérance inspire. Continuons sur cette lancée !`
    ]
  };

  const welcomeMessage = isNewUser 
    ? welcomeMessages.newUser[Math.floor(Math.random() * welcomeMessages.newUser.length)]
    : welcomeMessages.returning[Math.floor(Math.random() * welcomeMessages.returning.length)];

  // Citations de motivation basées sur le niveau et les objectifs
  const motivationQuote = generateMotivationalQuote(user, onboarding);

  // Objectifs quotidiens personnalisés
  const dailyGoal = generateDailyGoal(user, onboarding);

  // Messages de progression
  const progressMessage = generateProgressMessage(user, onboarding);

  // Messages de recommandation
  const recommendationMessage = generateRecommendationMessage(user, onboarding);

  // Suggestions d'étapes suivantes
  const nextStepSuggestion = generateNextStepSuggestion(user, onboarding);

  // Messages d'achievement (si applicable)
  const achievementMessage = generateAchievementMessage(user);

  return {
    welcomeMessage,
    motivationQuote,
    dailyGoal,
    progressMessage,
    recommendationMessage,
    achievementMessage,
    nextStepSuggestion
  };
}

function generateMotivationalQuote(user: UserProfile, onboarding?: OnboardingData): string {
  const skillLevel = onboarding?.skillLevel || 'beginner';
  const objectives = onboarding?.learningObjectives || [];
  const domains = onboarding?.domainsOfInterest || [];

  const quotes = {
    beginner: [
      "Chaque expert était un jour un débutant. Votre voyage vers l'excellence commence maintenant !",
      "L'apprentissage est un voyage, pas une destination. Profitez de chaque étape de votre transformation !",
      "La curiosité est le moteur de l'apprentissage. Gardez cette flamme vivante en vous !",
      "Votre potentiel est illimité. Chaque jour d'apprentissage vous rapproche de vos rêves !"
    ],
    intermediate: [
      "Vous construisez une base solide. Continuez à explorer et à grandir, l'expertise se développe jour après jour !",
      "Chaque nouveau concept maîtrisé vous rapproche de vos objectifs. Vous êtes sur la bonne voie !",
      "Votre persévérance commence à porter ses fruits. L'excellence est à portée de main !",
      "Vous transformez vos connaissances en compétences. C'est le signe d'un vrai apprentissage !"
    ],
    advanced: [
      "Votre expertise inspire les autres. Partagez votre savoir et continuez à grandir !",
      "L'excellence est un choix quotidien. Vous l'avez fait, continuez sur cette voie !",
      "Vous êtes un exemple de persévérance et de dévouement. Votre maîtrise est remarquable !",
      "Votre niveau d'expertise ouvre de nouvelles portes. Explorez les horizons qui s'offrent à vous !"
    ]
  };

  let selectedQuotes = quotes[skillLevel as keyof typeof quotes] || quotes.beginner;

  // Personnaliser selon les objectifs
  if (objectives.length > 0) {
    const objective = objectives[0];
    if (objective.includes("développeur")) {
      selectedQuotes.push("Le code est votre art, chaque ligne vous rapproche de la maîtrise !");
    } else if (objective.includes("IA")) {
      selectedQuotes.push("L'intelligence artificielle est l'avenir, et vous en faites partie !");
    } else if (objective.includes("marketing")) {
      selectedQuotes.push("Le marketing digital évolue constamment, votre apprentissage vous maintient à la pointe !");
    }
  }

  return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
}

function generateDailyGoal(user: UserProfile, onboarding?: OnboardingData): string {
  const weeklyHours = onboarding?.weeklyHours || 0;
  const skillLevel = onboarding?.skillLevel || 'beginner';
  const dailyMinutes = Math.round((weeklyHours * 60) / 7);
  
  if (dailyMinutes < 15) {
    return "Objectif du jour : 15 minutes d'apprentissage pour maintenir l'élan !";
  } else if (dailyMinutes < 30) {
    return `Objectif du jour : ${dailyMinutes} minutes d'apprentissage ciblé !`;
  } else {
    return `Objectif du jour : ${dailyMinutes} minutes d'apprentissage intensif pour maximiser votre progression !`;
  }
}

function generateProgressMessage(user: UserProfile, onboarding?: OnboardingData): string {
  if (user.totalCoursesCompleted === 0) {
    return "Commencez par explorer nos cours recommandés, spécialement sélectionnés pour vous !";
  }

  if (user.totalCoursesCompleted === 1) {
    return "Félicitations pour votre premier cours terminé ! C'est le début d'une belle aventure !";
  }

  if (user.streakDays > 0) {
    return `Impressionnant ! Vous maintenez un rythme de ${user.streakDays} jours consécutifs. Votre engagement est remarquable !`;
  }

  return `Excellent travail ! Vous avez terminé ${user.totalCoursesCompleted} cours. Chaque étape compte dans votre progression !`;
}

function generateRecommendationMessage(user: UserProfile, onboarding?: OnboardingData): string {
  if (!onboarding) {
    return "Découvrez nos cours populaires pour commencer votre apprentissage personnalisé.";
  }

  const objectives = onboarding.learningObjectives || [];
  const domains = onboarding.domainsOfInterest || [];
  const skillLevel = onboarding.skillLevel;

  if (objectives.length > 0 && domains.length > 0) {
    return `Basé sur votre objectif "${objectives[0]}" et votre intérêt pour "${domains[0]}", nous avons sélectionné des cours parfaits pour votre niveau ${skillLevel}.`;
  } else if (objectives.length > 0) {
    return `Pour atteindre votre objectif "${objectives[0]}", voici nos meilleures recommandations adaptées à votre profil.`;
  } else if (domains.length > 0) {
    return `Dans le domaine "${domains[0]}", nous avons des cours qui correspondent parfaitement à votre niveau et à vos préférences.`;
  }

  return "Découvrez nos cours recommandés, spécialement adaptés à votre profil d'apprentissage et à vos objectifs.";
}

function generateNextStepSuggestion(user: UserProfile, onboarding?: OnboardingData): string {
  if (!user.onboardingCompleted) {
    return "Complétez votre onboarding pour recevoir des recommandations ultra-personnalisées basées sur vos objectifs !";
  }

  if (user.totalCoursesCompleted === 0) {
    return "Commencez par un cours de votre domaine d'intérêt pour prendre de l'élan et construire votre confiance !";
  }

  if (user.streakDays === 0) {
    return "Reprenez votre rythme d'apprentissage avec un cours court et engageant pour relancer votre motivation !";
  }

  if (user.totalCertifications === 0) {
    return "Obtenez votre première certification pour marquer votre progression et valoriser vos compétences !";
  }

  if (user.totalCoursesCompleted < 3) {
    return "Continuez sur votre lancée avec un cours plus avancé dans votre domaine pour approfondir vos connaissances !";
  }

  return "Explorez de nouveaux domaines ou approfondissez vos compétences existantes. Votre curiosité est votre meilleur atout !";
}

function generateAchievementMessage(user: UserProfile): string | undefined {
  if (user.totalCertifications > 0 && user.totalCertifications % 5 === 0) {
    return `🎉 Félicitations ! Vous avez obtenu ${user.totalCertifications} certifications. Votre expertise grandit chaque jour !`;
  }

  if (user.streakDays >= 7) {
    return `🔥 Incroyable ! Vous maintenez un rythme de ${user.streakDays} jours consécutifs. Votre discipline est exemplaire !`;
  }

  if (user.totalCoursesCompleted > 0 && user.totalCoursesCompleted % 10 === 0) {
    return `🏆 Bravo ! Vous avez terminé ${user.totalCoursesCompleted} cours. Votre persévérance porte ses fruits !`;
  }

  return undefined;
} 