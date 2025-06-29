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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const offset = (page - 1) * limit;

    // Paramètres de filtrage
    const search = searchParams.get("search") || "";
    const platform = searchParams.get("platform") || "";
    const institution = searchParams.get("institution") || "";
    const level = searchParams.get("level") || "";
    const language = searchParams.get("language") || "";
    const format = searchParams.get("format") || "";
    const price_numeric = searchParams.get("price_numeric") || "";
    const rating = searchParams.get("rating") || "";
    const duration = searchParams.get("duration") || "";
    const sortBy = searchParams.get("sortBy") || "title";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    console.log("🔍 Paramètres de filtrage reçus:", {
      search, platform, institution, level, language, format, price_numeric, rating, duration, sortBy, sortOrder
    });

    // Construction des conditions de filtrage
    const whereConditions = [];

    // Recherche
    if (search) {
      whereConditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { platform: { contains: search, mode: "insensitive" as const } },
          { institution: { contains: search, mode: "insensitive" as const } },
        ]
      });
    }

    // Plateforme
    if (platform && platform !== "all") {
      whereConditions.push({ platform: { equals: platform, mode: "insensitive" as const } });
    }

    // Institution
    if (institution && institution !== "all") {
      whereConditions.push({ institution: { equals: institution, mode: "insensitive" as const } });
    }

    // Niveau - essayer d'abord level_normalized, puis level
    if (level && level !== "all") {
      whereConditions.push({
        OR: [
          { level_normalized: { equals: level, mode: "insensitive" as const } },
          { level: { equals: level, mode: "insensitive" as const } }
        ]
      });
    }

    // Langue
    if (language && language !== "all") {
      whereConditions.push({ language: { equals: language, mode: "insensitive" as const } });
    }

    // Format
    if (format && format !== "all") {
      whereConditions.push({ format: { equals: format, mode: "insensitive" as const } });
    }

    // Prix
    if (price_numeric && price_numeric !== "0" && price_numeric !== "all") {
      const priceValue = parseInt(price_numeric, 10);
      if (priceValue === 1) { // Gratuit
        whereConditions.push({ price_numeric: { equals: 0 } });
      } else if (priceValue === 2) { // Payant
        whereConditions.push({ price_numeric: { gt: 0 } });
      }
    }

    // Note
    if (rating && rating !== "all") {
      const minRating = parseFloat(rating.replace("+", ""));
      if (!isNaN(minRating)) {
        whereConditions.push({ rating_numeric: { gte: minRating } });
      }
    }

    // Durée
    if (duration && duration !== "all") {
      if (duration === "10h+") {
        whereConditions.push({ duration_hours: { gte: 10 } });
      } else {
        const [minHours, maxHours] = duration.split("-").map(h => {
          if (h.includes("h")) {
            return parseFloat(h.replace("h", ""));
          }
          return parseFloat(h);
        });
        
        if (!isNaN(minHours) && !isNaN(maxHours)) {
          whereConditions.push({ 
            duration_hours: { 
              gte: minHours, 
              lt: maxHours 
            } 
          });
        }
      }
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    console.log("🔍 Conditions WHERE:", JSON.stringify(where, null, 2));

    // Validation du tri
    const validSortFields = [
      "title",
      "rating_numeric",
      "duration_hours",
      "price_numeric",
      "createdAt",
      "updatedAt",
      "platform",
      "institution",
    ];
    const validSortOrders = ["asc", "desc"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "title";
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

    console.log("🔍 Tri final:", { sortBy: finalSortBy, sortOrder: finalSortOrder });

    // Récupération des cours avec pagination
    const [courses, totalCourses] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { [finalSortBy]: finalSortOrder },
        take: limit,
        skip: offset,
        select: {
          id: true,
          course_id: true,
          title: true,
          link: true,
          platform: true,
          institution: true,
          instructor: true,
          description: true,
          skills: true,
          category: true,
          level_normalized: true,
          duration_hours: true,
          price_numeric: true,
          rating_numeric: true,
          reviews_count_numeric: true,
          enrolled_students: true,
          course_type: true,
          mode: true,
          availability: true,
          source_file: true,
          // Champs de compatibilité
          provider: true,
          level: true,
          rating: true,
          price: true,
          language: true,
          format: true,
          url: true,
          certificate_type: true,
          start_date: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.course.count({ where }),
    ]);

    console.log(`🔍 ${courses.length} cours trouvés sur ${totalCourses} total`);

    // Si l'utilisateur est connecté, récupérer les informations de progression
    let coursesWithProgress = courses;
    if (userId) {
      console.log("API Courses - User ID:", userId);
      console.log(
        "API Courses - Course IDs:",
        courses.map((c) => c.id)
      );

      const userProgress = await prisma.user_course_progress.findMany({
        where: {
          userId: userId,
          courseId: { in: courses.map((course) => course.id) },
        },
        select: {
          courseId: true,
          status: true,
          progressPercentage: true,
          completedAt: true,
          startedAt: true,
          favorite: true,
        },
      });

      console.log("API Courses - User Progress found:", userProgress);

      // Créer un map pour un accès rapide
      const progressMap = new Map(
        userProgress.map((p: any) => [p.courseId, p])
      );

      // Fusionner les données
      coursesWithProgress = courses.map((course) => {
        const progress = progressMap.get(course.id);
        const result = {
          ...course,
          status: progress?.status || "not_started",
          progressPercentage: progress?.progressPercentage || 0,
          completedAt: progress?.completedAt || null,
          startedAt: progress?.startedAt || null,
          favorite: progress?.favorite || false,
        };
        console.log(`API Courses - Course ${course.id} (${course.title}):`, {
          progressStatus: progress?.status,
          finalStatus: result.status,
          progressPercentage: result.progressPercentage,
          favorite: result.favorite,
        });
        return result;
      });
    } else {
      console.log("API Courses - No user session found");
      // Si pas d'utilisateur connecté, ajouter des valeurs par défaut
      coursesWithProgress = courses.map((course) => ({
        ...course,
        status: "not_started",
        progressPercentage: 0,
        completedAt: null,
        startedAt: null,
        favorite: false,
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
        institution,
        level,
        language,
        format,
        price_numeric,
        rating,
        duration,
        sortBy: finalSortBy,
        sortOrder: finalSortOrder,
      },
    });
  } catch (error) {
    console.error("Erreur lors du chargement des cours:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des cours", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
