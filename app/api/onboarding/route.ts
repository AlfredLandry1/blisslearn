import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Créer ou mettre à jour les réponses d'onboarding avec requête SQL brute
    const onboarding = await prisma.$executeRaw`
      INSERT INTO onboarding_responses (
        id, userId, learningObjectives, domainsOfInterest, skillLevel, 
        weeklyHours, preferredPlatforms, courseFormat, courseDuration, 
        courseLanguage, isCompleted, completedAt, createdAt, updatedAt
      ) VALUES (
        UUID(), ${session.user.id}, 
        ${JSON.stringify(data.learningObjectives || [])}, 
        ${JSON.stringify(data.domainsOfInterest || [])}, 
        ${data.skillLevel || ""}, ${data.weeklyHours || 0}, 
        ${JSON.stringify(data.preferredPlatforms || [])}, 
        ${JSON.stringify(data.coursePreferences?.format || [])}, 
        ${data.coursePreferences?.duration || ""}, 
        ${data.coursePreferences?.language || ""}, 
        true, NOW(), NOW(), NOW()
      ) ON DUPLICATE KEY UPDATE
        learningObjectives = VALUES(learningObjectives),
        domainsOfInterest = VALUES(domainsOfInterest),
        skillLevel = VALUES(skillLevel),
        weeklyHours = VALUES(weeklyHours),
        preferredPlatforms = VALUES(preferredPlatforms),
        courseFormat = VALUES(courseFormat),
        courseDuration = VALUES(courseDuration),
        courseLanguage = VALUES(courseLanguage),
        isCompleted = true,
        completedAt = NOW(),
        updatedAt = NOW()
    `;

    return NextResponse.json(
      { 
        message: "Onboarding complété avec succès",
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'onboarding:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les réponses d'onboarding existantes avec requête SQL brute
    const onboarding = await prisma.$queryRaw`
      SELECT * FROM onboarding_responses WHERE userId = ${session.user.id} LIMIT 1
    `;

    if (!onboarding || (onboarding as any[]).length === 0) {
      return NextResponse.json(
        { onboarding: null },
        { status: 200 }
      );
    }

    const onboardingData = (onboarding as any[])[0];

    // Parser les données JSON stockées
    const parsedOnboarding = {
      ...onboardingData,
      learningObjectives: JSON.parse(onboardingData.learningObjectives),
      domainsOfInterest: JSON.parse(onboardingData.domainsOfInterest),
      preferredPlatforms: JSON.parse(onboardingData.preferredPlatforms),
      coursePreferences: {
        format: JSON.parse(onboardingData.courseFormat),
        duration: onboardingData.courseDuration,
        language: onboardingData.courseLanguage,
      },
    };

    return NextResponse.json(
      { onboarding: parsedOnboarding },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la récupération de l'onboarding:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 