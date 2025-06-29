import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from "@/lib/prisma";
import { safeJsonParseArray } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'all'; // all, similar, next-level, trending

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Récupérer la progression de l'utilisateur
    const userProgress = await prisma.user_course_progress.findMany({
      where: { userId: user.id },
      include: { course: true }
    });

    // Analyser les préférences
    const preferences = analyzeUserPreferences(userProgress);
    
    // Générer les recommandations selon le type
    let recommendations: any[] = [];
    
    switch (type) {
      case 'similar':
        recommendations = await getSimilarCourses(preferences, userProgress, limit);
        break;
      case 'next-level':
        recommendations = await getNextLevelCourses(preferences, userProgress, limit);
        break;
      case 'trending':
        recommendations = await getTrendingCourses(preferences, limit);
        break;
      default:
        recommendations = await getAllRecommendations(preferences, userProgress, limit);
    }

    return NextResponse.json({
      recommendations,
      preferences,
      totalFound: recommendations.length
    });
  } catch (error) {
    console.error("Erreur lors de la génération des recommandations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des recommandations" },
      { status: 500 }
    );
  }
}

function analyzeUserPreferences(userProgress: any[]) {
  const preferences = {
    platforms: {} as Record<string, number>,
    levels: {} as Record<string, number>,
    languages: {} as Record<string, number>,
    skills: [] as string[],
    averageProgress: 0,
    completionRate: 0,
    favoriteTopics: [] as string[]
  };

  if (userProgress.length === 0) {
    return preferences;
  }

  // Analyser les plateformes préférées
  userProgress.forEach(progress => {
    const platform = progress.course.platform;
    if (platform) {
      preferences.platforms[platform] = (preferences.platforms[platform] || 0) + 1;
    }

    const level = progress.course.level;
    if (level) {
      preferences.levels[level] = (preferences.levels[level] || 0) + 1;
    }

    const language = progress.course.language;
    if (language) {
      preferences.languages[language] = (preferences.languages[language] || 0) + 1;
    }

    // Analyser les compétences
    if (progress.course.skills) {
      try {
        const skills = safeJsonParseArray(progress.course.skills);
        if (Array.isArray(skills)) {
          preferences.skills.push(...skills);
        }
      } catch (e) {
        // Ignorer si le parsing échoue
      }
    }

    // Analyser les favoris
    if (progress.favorite) {
      preferences.favoriteTopics.push(progress.course.title);
    }
  });

  // Calculer les moyennes
  preferences.averageProgress = userProgress.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / userProgress.length;
  preferences.completionRate = userProgress.filter(p => p.status === 'completed').length / userProgress.length;

  // Nettoyer et trier les préférences
  preferences.skills = [...new Set(preferences.skills)];
  preferences.favoriteTopics = [...new Set(preferences.favoriteTopics)];

  return preferences;
}

async function getSimilarCourses(preferences: any, userProgress: any[], limit: number) {
  const userCourseIds = userProgress.map(p => p.courseId);
  const topPlatforms = Object.entries(preferences.platforms)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([platform]) => platform);

  const topLevels = Object.entries(preferences.levels)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([level]) => level);

  const similarCourses = await prisma.course.findMany({
    where: {
      id: { notIn: userCourseIds },
      platform: { in: topPlatforms },
      level: { in: topLevels }
    },
    take: limit,
    orderBy: { rating: 'desc' }
  });

  return similarCourses.map(course => ({
    ...course,
    reason: "Similaire à vos cours préférés",
    score: calculateSimilarityScore(course, preferences)
  }));
}

async function getNextLevelCourses(preferences: any, userProgress: any[], limit: number) {
  const userCourseIds = userProgress.map(p => p.courseId);
  const completedCourses = userProgress.filter(p => p.status === 'completed');
  
  if (completedCourses.length === 0) {
    return [];
  }

  // Déterminer le niveau suivant
  const currentLevels = completedCourses.map(p => p.course.level).filter(Boolean);
  const nextLevels = getNextLevels(currentLevels);

  const nextLevelCourses = await prisma.course.findMany({
    where: {
      id: { notIn: userCourseIds },
      level: { in: nextLevels },
      platform: { in: Object.keys(preferences.platforms) }
    },
    take: limit,
    orderBy: { rating: 'desc' }
  });

  return nextLevelCourses.map(course => ({
    ...course,
    reason: "Niveau suivant recommandé",
    score: calculateNextLevelScore(course, preferences)
  }));
}

async function getTrendingCourses(preferences: any, limit: number) {
  // Simuler des cours tendance (dans un vrai système, on utiliserait des analytics)
  const trendingCourses = await prisma.course.findMany({
    where: {
      rating: { gte: 4.0 },
      platform: { in: Object.keys(preferences.platforms) }
    },
    take: limit,
    orderBy: [
      { rating: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return trendingCourses.map(course => ({
    ...course,
    reason: "Cours populaire et bien noté",
    score: calculateTrendingScore(course, preferences)
  }));
}

async function getAllRecommendations(preferences: any, userProgress: any[], limit: number) {
  const userCourseIds = userProgress.map(p => p.courseId);
  
  // Combiner différents types de recommandations
  const [similar, nextLevel, trending] = await Promise.all([
    getSimilarCourses(preferences, userProgress, Math.ceil(limit / 3)),
    getNextLevelCourses(preferences, userProgress, Math.ceil(limit / 3)),
    getTrendingCourses(preferences, Math.ceil(limit / 3))
  ]);

  // Fusionner et trier par score
  const allRecommendations = [...similar, ...nextLevel, ...trending]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);

  return allRecommendations;
}

function getNextLevels(currentLevels: string[]): string[] {
  const levelHierarchy = {
    'Débutant': 'Intermédiaire',
    'Intermédiaire': 'Avancé',
    'Avancé': 'Expert'
  };

  const nextLevels = currentLevels
    .map(level => levelHierarchy[level as keyof typeof levelHierarchy])
    .filter(Boolean);

  return nextLevels.length > 0 ? nextLevels : ['Intermédiaire', 'Avancé'];
}

function calculateSimilarityScore(course: any, preferences: any): number {
  let score = 0;
  
  // Score pour la plateforme
  if (preferences.platforms[course.platform]) {
    score += preferences.platforms[course.platform] * 10;
  }
  
  // Score pour le niveau
  if (preferences.levels[course.level]) {
    score += preferences.levels[course.level] * 8;
  }
  
  // Score pour la langue
  if (preferences.languages[course.language]) {
    score += preferences.languages[course.language] * 5;
  }
  
  // Score pour la note
  if (course.rating) {
    score += course.rating * 2;
  }
  
  return score;
}

function calculateNextLevelScore(course: any, preferences: any): number {
  let score = 50; // Score de base pour le niveau suivant
  
  // Bonus pour la plateforme préférée
  if (preferences.platforms[course.platform]) {
    score += 20;
  }
  
  // Bonus pour la note
  if (course.rating) {
    score += course.rating * 10;
  }
  
  return score;
}

function calculateTrendingScore(course: any, preferences: any): number {
  let score = 0;
  
  // Score de base pour la popularité
  score += 30;
  
  // Bonus pour la note
  if (course.rating) {
    score += course.rating * 15;
  }
  
  // Bonus pour la plateforme préférée
  if (preferences.platforms[course.platform]) {
    score += 10;
  }
  
  return score;
} 