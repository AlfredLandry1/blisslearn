import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = (page - 1) * limit;
    
    // Paramètres de filtrage
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const platform = searchParams.get('platform') || '';
    const level = searchParams.get('level') || '';
    const language = searchParams.get('language') || '';
    const favorite = searchParams.get('favorite') || '';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Construction des conditions de filtrage
    const where = {
      userId: user.id,
      AND: [
        // Par défaut, exclure les cours non commencés sauf si l'utilisateur demande explicitement à les voir
        status === 'not_started' ? { status: { equals: 'not_started' } } : 
        status && status !== 'all' ? { status: { equals: status } } : 
        { status: { not: 'not_started' } },
        search
          ? {
              course: {
                OR: [
                  { title: { contains: search, mode: 'insensitive' as const } },
                  { description: { contains: search, mode: 'insensitive' as const } },
                  { platform: { contains: search, mode: 'insensitive' as const } },
                ],
              },
            }
          : {},
        platform && platform !== 'all' ? { course: { platform: { equals: platform, mode: 'insensitive' as const } } } : {},
        level && level !== 'all' ? { course: { level_normalized: { equals: level, mode: 'insensitive' as const } } } : {},
        language && language !== 'all' ? { course: { language: { equals: language, mode: 'insensitive' as const } } } : {},
        favorite === 'true' ? { favorite: true } : {},
        favorite === 'false' ? { favorite: false } : {},
      ],
    };

    // Validation du tri
    const validSortFields = ['updatedAt', 'startedAt', 'progressPercentage', 'rating_numeric'];
    const validSortOrders = ['asc', 'desc'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'updatedAt';
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    // Récupération des cours avec pagination
    const [progresses, totalProgresses] = await Promise.all([
      prisma.user_course_progress.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              platform: true,
              provider: true,
              level_normalized: true,
              duration: true,
              rating_numeric: true,
              price_numeric: true,
              language: true,
              format: true,
              link: true,
              skills: true,
              course_type: true,
              start_date: true,
            }
          }
        },
        orderBy: { [finalSortBy]: finalSortOrder },
        take: limit,
        skip: offset,
      }),
      prisma.user_course_progress.count({ where })
    ]);

    // Transformer les données pour être compatibles avec le store
    const transformedCourses = progresses.map(progress => ({
      id: progress.course.id,
      title: progress.course.title,
      status: progress.status,
      favorite: progress.favorite,
      progressPercentage: Number(progress.progressPercentage) || 0,
      platform: progress.course.platform,
      level: progress.course.level_normalized,
      language: progress.course.language,
      notes: progress.notes,
      timeSpent: progress.timeSpent,
      currentPosition: progress.currentPosition,
      // Ajouter les autres propriétés du cours si nécessaire
      description: progress.course.description,
      provider: progress.course.provider,
      duration: progress.course.duration,
      rating: progress.course.rating_numeric,
      price: progress.course.price_numeric,
      format: progress.course.format,
      link: progress.course.link,
      skills: progress.course.skills,
      course_type: progress.course.course_type,
      start_date: progress.course.start_date,
    }));

    const totalPages = Math.ceil(totalProgresses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calcul des statistiques globales (excluant les cours non commencés par défaut)
    const globalStats = await prisma.user_course_progress.aggregate({
      where: { 
        userId: user.id,
        status: { not: 'not_started' }
      },
      _count: { id: true },
      _avg: { progressPercentage: true },
      _sum: { timeSpent: true },
    });

    const inProgressCount = await prisma.user_course_progress.count({
      where: { 
        userId: user.id,
        status: { in: ['in_progress', 'started'] }
      }
    });

    const completedCount = await prisma.user_course_progress.count({
      where: { 
        userId: user.id,
        status: 'completed'
      }
    });

    const favoriteCount = await prisma.user_course_progress.count({
      where: { 
        userId: user.id,
        favorite: true,
        status: { not: 'not_started' }
      }
    });

    // Calculer le progrès global moyen
    const globalProgress = Math.round(Number(globalStats._avg.progressPercentage) || 0);

    return NextResponse.json({
      courses: transformedCourses,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalProgresses,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      globalStats: {
        totalCourses: globalStats._count.id,
        completedCourses: completedCount,
        inProgressCourses: inProgressCount,
        favoriteCourses: favoriteCount,
        globalProgress: globalProgress,
        averageProgress: globalStats._avg.progressPercentage || 0,
        totalTimeSpent: globalStats._sum.timeSpent || 0,
      },
      filters: {
        search,
        status,
        platform,
        level,
        language,
        favorite,
        sortBy: finalSortBy,
        sortOrder: finalSortOrder,
      }
    });
  } catch (error) {
    console.error('Erreur lors du chargement des cours:', error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des cours" }, 
      { status: 500 }
    );
  }
} 