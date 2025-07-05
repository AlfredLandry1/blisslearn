import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Statistiques globales (hors cours non commencés)
    const globalStats = await prisma.user_course_progress.aggregate({
      where: { userId: user.id, status: { not: 'not_started' } },
      _count: { id: true },
      _avg: { progressPercentage: true },
      _sum: { timeSpent: true },
    });
    const inProgressCount = await prisma.user_course_progress.count({
      where: { userId: user.id, status: { in: ['in_progress', 'started'] } }
    });
    const completedCount = await prisma.user_course_progress.count({
      where: { userId: user.id, status: 'completed' }
    });
    const favoriteCount = await prisma.user_course_progress.count({
      where: { userId: user.id, favorite: true, status: { not: 'not_started' } }
    });
    const globalProgress = Math.round(Number(globalStats._avg.progressPercentage) || 0);

    // 3 cours en cours (status in_progress ou started)
    const progresses = await prisma.user_course_progress.findMany({
      where: { userId: user.id, status: { in: ['in_progress', 'started'] } },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            platform: true,
            duration: true,
            rating_numeric: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3
    });
    const currentCourses = progresses.map(progress => ({
      id: progress.course.id,
      title: progress.course.title,
      platform: progress.course.platform,
      rating: progress.course.rating_numeric,
      progressPercentage: Number(progress.progressPercentage) || 0,
      duration: progress.course.duration,
      favorite: progress.favorite,
    }));

    return NextResponse.json({
      globalStats: {
        totalCourses: globalStats._count.id,
        completedCourses: completedCount,
        inProgressCourses: inProgressCount,
        favoriteCourses: favoriteCount,
        globalProgress: globalProgress,
        averageProgress: globalStats._avg.progressPercentage || 0,
        totalTimeSpent: globalStats._sum.timeSpent || 0,
      },
      currentCourses,
    });
  } catch (error) {
    console.error('Erreur chargement dashboard:', error);
    return NextResponse.json({ error: "Erreur lors du chargement du dashboard" }, { status: 500 });
  }
} 