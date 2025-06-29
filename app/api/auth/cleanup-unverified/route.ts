import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Vérifier la clé API pour sécuriser l'endpoint
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CLEANUP_API_KEY;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Calculer la date limite (7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Supprimer les comptes non vérifiés de plus de 7 jours
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        emailVerified: null,
        createdAt: {
          lt: sevenDaysAgo
        },
        // Exclure l'admin de test
        email: {
          not: "alfred@test.mail"
        }
      }
    });

    console.log(`🧹 Nettoyage automatique : ${deletedUsers.count} comptes non vérifiés supprimés`);

    return NextResponse.json({
      message: "Nettoyage terminé avec succès",
      deletedCount: deletedUsers.count,
      cleanedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Erreur lors du nettoyage des comptes non vérifiés:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 