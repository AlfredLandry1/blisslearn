import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { OnboardingData } from "@/components/onboarding/types";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data, step, completed }: { 
      data: OnboardingData; 
      step?: number; 
      completed?: boolean 
    } = body;

    console.log("📝 Sauvegarde onboarding:", {
      email: session.user.email,
      step,
      completed,
      dataKeys: Object.keys(data || {})
    });

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Sauvegarder les données d'onboarding dans la table onboarding_responses
    const onboardingData = await prisma.onboarding_responses.upsert({
      where: { userId: user.id },
      update: {
        learningObjectives: JSON.stringify(data.learningObjectives || []),
        domainsOfInterest: JSON.stringify(data.domainsOfInterest || []),
        skillLevel: data.skillLevel || "",
        weeklyHours: data.weeklyHours || 0,
        preferredPlatforms: JSON.stringify(data.preferredPlatforms || []),
        courseFormat: JSON.stringify(data.coursePreferences?.format || []),
        courseDuration: data.coursePreferences?.duration || "",
        courseLanguage: data.coursePreferences?.language || "",
        isCompleted: completed || false,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        learningObjectives: JSON.stringify(data.learningObjectives || []),
        domainsOfInterest: JSON.stringify(data.domainsOfInterest || []),
        skillLevel: data.skillLevel || "",
        weeklyHours: data.weeklyHours || 0,
        preferredPlatforms: JSON.stringify(data.preferredPlatforms || []),
        courseFormat: JSON.stringify(data.coursePreferences?.format || []),
        courseDuration: data.coursePreferences?.duration || "",
        courseLanguage: data.coursePreferences?.language || "",
        isCompleted: completed || false,
        completedAt: completed ? new Date() : null
      }
    });

    // Mettre à jour le statut d'onboarding dans la table user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingCompleted: completed || false,
        onboardingStep: step || 1
      }
    });

    console.log("✅ Onboarding sauvegardé:", {
      userId: onboardingData.userId,
      completed: onboardingData.isCompleted,
      step: step || 1
    });

    return NextResponse.json({
      success: true,
      data: {
        id: onboardingData.id,
        userId: onboardingData.userId,
        isCompleted: onboardingData.isCompleted,
        completedAt: onboardingData.completedAt,
        step: step || 1
      },
      message: completed ? "Onboarding complété avec succès" : "Données sauvegardées"
    });

  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde de l'onboarding:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les données d'onboarding existantes
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        onboardingCompleted: true,
        onboardingStep: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les réponses d'onboarding
    const onboardingResponses = await prisma.onboarding_responses.findUnique({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      data: {
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        onboardingData: onboardingResponses ? {
          learningObjectives: JSON.parse(onboardingResponses.learningObjectives || "[]"),
          domainsOfInterest: JSON.parse(onboardingResponses.domainsOfInterest || "[]"),
          skillLevel: onboardingResponses.skillLevel,
          weeklyHours: onboardingResponses.weeklyHours,
          preferredPlatforms: JSON.parse(onboardingResponses.preferredPlatforms || "[]"),
          coursePreferences: {
            format: JSON.parse(onboardingResponses.courseFormat || "[]"),
            duration: onboardingResponses.courseDuration,
            language: onboardingResponses.courseLanguage
          }
        } : null
      }
    });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'onboarding:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 