import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token de vérification requis" },
        { status: 400 }
      );
    }

    // Rechercher le token de vérification
    const verificationToken = await prisma.verificationtoken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Token de vérification invalide" },
        { status: 400 }
      );
    }

    // Vérifier si le token a expiré (24h)
    if (verificationToken.expires < new Date()) {
      // Supprimer le token expiré
      await prisma.verificationtoken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: "Token de vérification expiré" },
        { status: 400 }
      );
    }

    // Marquer l'email comme vérifié
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Supprimer le token utilisé
    await prisma.verificationtoken.delete({
      where: { token },
    });

    return NextResponse.json(
      { message: "Email vérifié avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la vérification d'email:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 