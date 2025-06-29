import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'utilisateur complet pour avoir l'ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') as 'week' | 'month' | 'year' || 'month';

    // Récupérer toutes les progressions de cours de l'utilisateur
    const userProgress = await prisma.user_course_progress.findMany({
      where: { userId: user.id },
      include: {
        course: true,
        milestones: {
          where: { isCompleted: true }
        }
      }
    });

    // Calculer les statistiques globales
    const totalCourses = userProgress.length;
    const completedCourses = userProgress.filter(p => p.status === 'completed').length;
    const inProgressCourses = userProgress.filter(p => p.status === 'in_progress').length;
    const favoriteCourses = userProgress.filter(p => p.favorite).length;

    // Calculer la progression moyenne globale
    const totalProgress = userProgress.reduce((sum, p) => sum + Number(p.progressPercentage || 0), 0);
    const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

    // Calculer le temps total passé (en minutes)
    const totalTimeSpent = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    // Calculer le taux de completion
    const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    // Calculer la série de jours
    const streakDays = await calculateStreakDays(user.id);

    // Calculer la progression hebdomadaire/mensuelle
    const weeklyProgress = await calculatePeriodProgress(user.id, 'week');
    const monthlyProgress = await calculatePeriodProgress(user.id, 'month');

    // Calculer les plateformes préférées
    const platformStats = userProgress.reduce((acc, progress) => {
      const platform = progress.course.platform || 'Autre';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlatforms = Object.entries(platformStats)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Récupérer l'activité récente
    const recentActivity = await getRecentActivity(user.id);

    return NextResponse.json({
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
      totalTimeSpent,
      favoriteCourses,
      completionRate,
      streakDays,
      weeklyProgress,
      monthlyProgress,
      topPlatforms,
      recentActivity
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

async function calculateStreakDays(userId: string): Promise<number> {
  try {
    // Récupérer les activités des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await prisma.user_course_progress.findMany({
      where: {
        userId,
        updatedAt: { gte: thirtyDaysAgo }
      },
      select: {
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    if (activities.length === 0) return 0;

    // Grouper par jour
    const dailyActivities = activities.reduce((acc, activity) => {
      const date = activity.updatedAt.toDateString();
      acc[date] = true;
      return acc;
    }, {} as Record<string, boolean>);

    // Calculer la série
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();
      
      if (dailyActivities[dateString]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Erreur calcul série:", error);
    return 0;
  }
}

async function calculatePeriodProgress(userId: string, period: 'week' | 'month'): Promise<number> {
  try {
    const now = new Date();
    let periodStart: Date;
    let previousPeriodStart: Date;

    if (period === 'week') {
      periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    } else {
      periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }

    // Progression actuelle
    const currentProgress = await prisma.user_course_progress.findMany({
      where: {
        userId,
        updatedAt: { gte: periodStart }
      },
      select: { progressPercentage: true }
    });

    // Progression précédente
    const previousProgress = await prisma.user_course_progress.findMany({
      where: {
        userId,
        updatedAt: { gte: previousPeriodStart, lt: periodStart }
      },
      select: { progressPercentage: true }
    });

    const currentAvg = currentProgress.length > 0 
      ? currentProgress.reduce((sum, p) => sum + Number(p.progressPercentage || 0), 0) / currentProgress.length
      : 0;

    const previousAvg = previousProgress.length > 0
      ? previousProgress.reduce((sum, p) => sum + Number(p.progressPercentage || 0), 0) / previousProgress.length
      : 0;

    if (previousAvg === 0) return 0;
    
    return Math.round(((currentAvg - previousAvg) / previousAvg) * 100);
  } catch (error) {
    console.error("Erreur calcul progression période:", error);
    return 0;
  }
}

async function getRecentActivity(userId: string): Promise<Array<{courseTitle: string, action: string, date: string}>> {
  try {
    const recentProgress = await prisma.user_course_progress.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    return recentProgress.map(progress => {
      let action = "Mise à jour";
      if (progress.status === 'completed') {
        action = "Cours terminé";
      } else if (progress.status === 'in_progress') {
        action = "Progression mise à jour";
      } else if (progress.favorite) {
        action = "Ajouté aux favoris";
      }

      return {
        courseTitle: progress.course.title || "Cours sans titre",
        action,
        date: progress.updatedAt.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    });
  } catch (error) {
    console.error("Erreur récupération activité récente:", error);
    return [];
  }
} 