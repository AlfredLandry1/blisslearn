import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { safeJsonParseArray } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Créer ou mettre à jour les réponses d'onboarding
    const onboarding = await prisma.onboarding_responses.upsert({
      where: { userId: session.user.id },
      update: {
        learningObjectives: JSON.stringify(data.learningObjectives || []),
        domainsOfInterest: JSON.stringify(data.domainsOfInterest || []),
        skillLevel: data.skillLevel || "",
        weeklyHours: data.weeklyHours || 0,
        preferredPlatforms: JSON.stringify(data.preferredPlatforms || []),
        courseFormat: JSON.stringify(data.coursePreferences?.format || []),
        courseDuration: data.coursePreferences?.duration || "",
        courseLanguage: data.coursePreferences?.language || "",
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        learningObjectives: JSON.stringify(data.learningObjectives || []),
        domainsOfInterest: JSON.stringify(data.domainsOfInterest || []),
        skillLevel: data.skillLevel || "",
        weeklyHours: data.weeklyHours || 0,
        preferredPlatforms: JSON.stringify(data.preferredPlatforms || []),
        courseFormat: JSON.stringify(data.coursePreferences?.format || []),
        courseDuration: data.coursePreferences?.duration || "",
        courseLanguage: data.coursePreferences?.language || "",
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // Mettre à jour le statut d'onboarding dans la table user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        onboardingCompleted: true,
        onboardingStep: 7 // Étape finale
      }
    });

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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les réponses d'onboarding existantes
    const onboarding = await prisma.onboarding_responses.findUnique({
      where: { userId: session.user.id }
    });

    if (!onboarding) {
      return NextResponse.json(
        { onboarding: null },
        { status: 200 }
      );
    }

    // Parser les données JSON stockées
    const parsedOnboarding = {
      ...onboarding,
      learningObjectives: safeJsonParseArray(onboarding.learningObjectives),
      domainsOfInterest: safeJsonParseArray(onboarding.domainsOfInterest),
      preferredPlatforms: safeJsonParseArray(onboarding.preferredPlatforms),
      coursePreferences: {
        format: safeJsonParseArray(onboarding.courseFormat),
        duration: onboarding.courseDuration,
        language: onboarding.courseLanguage,
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