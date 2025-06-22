import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = (page - 1) * limit;
    
    // Paramètres de filtrage
    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform') || '';
    const level = searchParams.get('level') || '';
    const language = searchParams.get('language') || '';
    const sortBy = searchParams.get('sortBy') || 'title';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Construction des conditions de filtrage
    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
                { provider: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {},
        platform ? { platform: { equals: platform, mode: 'insensitive' as const } } : {},
        level ? { level: { equals: level, mode: 'insensitive' as const } } : {},
        language ? { language: { equals: language, mode: 'insensitive' as const } } : {},
      ],
    };

    // Validation du tri
    const validSortFields = ['title', 'rating', 'duration', 'price', 'createdAt'];
    const validSortOrders = ['asc', 'desc'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'title';
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'asc';

    // Récupération des cours avec pagination
    const [courses, totalCourses] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { [finalSortBy]: finalSortOrder },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          description: true,
          platform: true,
          provider: true,
          level: true,
          duration: true,
          rating: true,
          price: true,
          language: true,
          format: true,
          url: true,
          skills: true,
          certificate_type: true,
          start_date: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.course.count({ where })
    ]);

    // Si l'utilisateur est connecté, récupérer les informations de progression
    let coursesWithProgress = courses;
    if (userId) {
      console.log('API Courses - User ID:', userId);
      console.log('API Courses - Course IDs:', courses.map(c => c.id));
      
      const userProgress = await prisma.user_course_progress.findMany({
        where: {
          userId: userId,
          courseId: { in: courses.map(course => course.id) }
        },
        select: {
          courseId: true,
          status: true,
          progressPercentage: true,
          completedAt: true,
          startedAt: true,
        }
      });

      console.log('API Courses - User Progress found:', userProgress);

      // Créer un map pour un accès rapide
      const progressMap = new Map(userProgress.map((p: any) => [p.courseId, p]));

      // Fusionner les données
      coursesWithProgress = courses.map(course => {
        const progress = progressMap.get(course.id);
        const result = {
          ...course,
          status: progress?.status || 'not_started',
          progressPercentage: progress?.progressPercentage || 0,
          completedAt: progress?.completedAt || null,
          startedAt: progress?.startedAt || null,
        };
        console.log(`API Courses - Course ${course.id} (${course.title}):`, {
          progressStatus: progress?.status,
          finalStatus: result.status,
          progressPercentage: result.progressPercentage
        });
        return result;
      });
    } else {
      console.log('API Courses - No user session found');
      // Si pas d'utilisateur connecté, ajouter des valeurs par défaut
      coursesWithProgress = courses.map(course => ({
        ...course,
        status: 'not_started',
        progressPercentage: 0,
        completedAt: null,
        startedAt: null,
      }));
    }

    const totalPages = Math.ceil(totalCourses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      courses: coursesWithProgress,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCourses,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      filters: {
        search,
        platform,
        level,
        language,
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