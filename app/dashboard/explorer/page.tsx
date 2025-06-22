import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import CoursesPageClient from "@/app/dashboard/explorer/CoursesPageClient";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const PAGE_SIZE = 12;

async function getCourses(params: {
  search?: string;
  platform?: string;
  level?: string;
  language?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}) {
  const { 
    search = "", 
    platform = "", 
    level = "", 
    language = "", 
    sortBy = "title",
    sortOrder = "asc",
    page = 1,
    limit = PAGE_SIZE
  } = params;
  
  const offset = (page - 1) * limit;
  
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

  const coursesPromise = prisma.course.findMany({
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
  });

  const totalCoursesPromise = prisma.course.count({ where });

  const [courses, totalCourses] = await Promise.all([coursesPromise, totalCoursesPromise]);

  const totalPages = Math.ceil(totalCourses / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return { 
    courses, 
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCourses,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    }
  };
}

async function getFilterData() {
  try {
    // Utiliser la nouvelle API de filtres
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/filters`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des filtres:', error);
  }

  // Fallback vers la méthode directe si l'API échoue
  const platformsResult = await prisma.course.findMany({
    select: { platform: true },
    distinct: ["platform"],
    where: { platform: { not: null } },
    orderBy: { platform: "asc" }
  });
  const levelsResult = await prisma.course.findMany({
    select: { level: true },
    distinct: ["level"],
    where: { level: { not: null } },
    orderBy: { level: "asc" }
  });
  const languagesResult = await prisma.course.findMany({
    select: { language: true },
    distinct: ["language"],
    where: { language: { not: null } },
    orderBy: { language: "asc" }
  });

  return {
    platforms: platformsResult
      .map((p) => p.platform)
      .filter(Boolean) as string[],
    levels: levelsResult
      .map((l) => l.level)
      .filter(Boolean) as string[],
    languages: languagesResult
      .map((l) => l.language)
      .filter(Boolean) as string[],
  };
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    platform?: string;
    level?: string;
    language?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const params = await searchParams;
  const { 
    search, 
    platform, 
    level, 
    language, 
    sortBy, 
    sortOrder 
  } = params;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || PAGE_SIZE.toString(), 10);

  const { courses, pagination } = await getCourses({ 
    search, 
    platform, 
    level, 
    language, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  });
  const filters = await getFilterData();

  return (
    <Suspense fallback={<div>Chargement des cours...</div>}>
      <CoursesPageClient
        courses={courses}
        pagination={pagination}
        filters={filters}
        searchParams={params}
      />
    </Suspense>
  );
}
