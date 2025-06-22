import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Récupérer toutes les valeurs distinctes pour les filtres
    const [platforms, levels, languages] = await Promise.all([
      prisma.course.findMany({
        select: { platform: true },
        distinct: ["platform"],
        where: { platform: { not: null } },
        orderBy: { platform: "asc" }
      }),
      prisma.course.findMany({
        select: { level: true },
        distinct: ["level"],
        where: { level: { not: null } },
        orderBy: { level: "asc" }
      }),
      prisma.course.findMany({
        select: { language: true },
        distinct: ["language"],
        where: { language: { not: null } },
        orderBy: { language: "asc" }
      })
    ]);

    // Extraire les valeurs et filtrer les valeurs nulles
    const filterData = {
      platforms: platforms
        .map(p => p.platform)
        .filter(Boolean) as string[],
      levels: levels
        .map(l => l.level)
        .filter(Boolean) as string[],
      languages: languages
        .map(l => l.language)
        .filter(Boolean) as string[],
    };

    return NextResponse.json(filterData);
  } catch (error) {
    console.error('Erreur lors du chargement des filtres:', error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des filtres" }, 
      { status: 500 }
    );
  }
} 