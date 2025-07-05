import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Récupération des filtres disponibles...");
    
    // ✅ OPTIMISÉ : Une seule requête SQL pour récupérer tous les filtres
    const filtersData = await prisma.$queryRaw`
      SELECT 
        'platform' as type,
        platform as value
      FROM course 
      WHERE platform IS NOT NULL AND platform != '' 
      
      UNION ALL
      
      SELECT 
        'institution' as type,
        institution as value
      FROM course 
      WHERE institution IS NOT NULL AND institution != '' 
      
      UNION ALL
      
      SELECT 
        'level' as type,
        level_normalized as value
      FROM course 
      WHERE level_normalized IS NOT NULL AND level_normalized != '' 
      
      UNION ALL
      
      SELECT 
        'language' as type,
        language as value
      FROM course 
      WHERE language IS NOT NULL AND language != '' 
      
      UNION ALL
      
      SELECT 
        'format' as type,
        format as value
      FROM course 
      WHERE format IS NOT NULL AND format != '' 
      
      ORDER BY type, value
    `;

    // Traitement des résultats
    const result = {
      platforms: [] as string[],
      institutions: [] as string[],
      levels: [] as string[],
      languages: [] as string[],
      formats: [] as string[],
    };

    (filtersData as any[]).forEach(item => {
      switch (item.type) {
        case 'platform':
          result.platforms.push(item.value);
          break;
        case 'institution':
          result.institutions.push(item.value);
          break;
        case 'level':
          result.levels.push(item.value);
          break;
        case 'language':
          result.languages.push(item.value);
          break;
        case 'format':
          result.formats.push(item.value);
          break;
      }
    });

    // Supprimer les doublons
    result.platforms = [...new Set(result.platforms)];
    result.institutions = [...new Set(result.institutions)];
    result.levels = [...new Set(result.levels)];
    result.languages = [...new Set(result.languages)];
    result.formats = [...new Set(result.formats)];

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