import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Réinitialiser l'onboarding
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        onboardingCompleted: false,
        onboardingStep: 1
      }
    });

    // Supprimer les réponses d'onboarding existantes
    await prisma.onboarding_responses.deleteMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json(
      { 
        message: "Onboarding réinitialisé avec succès",
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la réinitialisation de l'onboarding:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 