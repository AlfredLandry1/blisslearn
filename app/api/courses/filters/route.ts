import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Récupération des filtres disponibles...");
    
    // ✅ OPTIMISÉ : Une seule requête pour récupérer toutes les valeurs uniques
    const [platforms, institutions, levels, languages, formats] = await Promise.all([
      // Plateformes
      prisma.$queryRaw`
        SELECT DISTINCT platform 
        FROM course 
        WHERE platform IS NOT NULL AND platform != '' 
        ORDER BY platform ASC
      `,
      
      // Institutions
      prisma.$queryRaw`
        SELECT DISTINCT institution 
        FROM course 
        WHERE institution IS NOT NULL AND institution != '' 
        ORDER BY institution ASC
      `,
      
      // Niveaux
      prisma.$queryRaw`
        SELECT DISTINCT level_normalized 
        FROM course 
        WHERE level_normalized IS NOT NULL AND level_normalized != '' 
        ORDER BY level_normalized ASC
      `,
      
      // Langues
      prisma.$queryRaw`
        SELECT DISTINCT language 
        FROM course 
        WHERE language IS NOT NULL AND language != '' 
        ORDER BY language ASC
      `,
      
      // Formats
      prisma.$queryRaw`
        SELECT DISTINCT format 
        FROM course 
        WHERE format IS NOT NULL AND format != '' 
        ORDER BY format ASC
      `
    ]);

    const result = {
      platforms: (platforms as any[]).map(p => p.platform).filter(Boolean),
      institutions: (institutions as any[]).map(i => i.institution).filter(Boolean),
      levels: (levels as any[]).map(l => l.level_normalized).filter(Boolean),
      languages: (languages as any[]).map(l => l.language).filter(Boolean),
      formats: (formats as any[]).map(f => f.format).filter(Boolean),
    };

    console.log("✅ Filtres récupérés avec succès:", {
      platforms: result.platforms.length,
      institutions: result.institutions.length,
      levels: result.levels.length,
      languages: result.languages.length,
      formats: result.formats.length,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des filtres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des filtres" },
      { status: 500 }
    );
  }
} 