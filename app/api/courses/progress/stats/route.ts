import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  try {
    // Récupérer tous les cours suivis par l'utilisateur
    const userCourses = await prisma.user_course_progress.findMany({
      where: { userId: user.id },
      include: { course: true },
    });

    // Calculer les statistiques globales
    const totalCourses = userCourses.length;
    const completedCourses = userCourses.filter(c => c.status === "completed").length;
    const inProgressCourses = userCourses.filter(c => c.status === "in_progress").length;
    const favoriteCourses = userCourses.filter(c => c.favorite).length;

    // Calculer la progression globale (moyenne des progressions individuelles)
    const totalProgress = userCourses.reduce((sum, course) => {
      const progress = Number(course.progressPercentage) || 0;
      return sum + progress;
    }, 0);
    
    const globalProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

    // Calculer les statistiques par cours avec progression
    const coursesWithProgress = userCourses.map(course => ({
      id: course.course.id,
      title: course.course.title,
      status: course.status,
      favorite: course.favorite,
      progressPercentage: course.progressPercentage || 0,
      startedAt: course.startedAt,
      completedAt: course.completedAt,
      platform: course.course.platform,
      level: course.course.level,
      language: course.course.language,
      notes: course.notes,
      timeSpent: course.timeSpent,
      currentPosition: course.currentPosition,
    }));

    return NextResponse.json({
      globalStats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        favoriteCourses,
        globalProgress,
      },
      coursesWithProgress,
    });
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
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