import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fonction pour supprimer automatiquement les anciennes notifications
async function cleanupOldNotifications() {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  try {
    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: fifteenDaysAgo
        }
      }
    });

    return {
      success: true,
      deletedCount: result.count,
      deletedBefore: fifteenDaysAgo.toISOString()
    };
  } catch (error) {
    console.error("Erreur lors du nettoyage des notifications:", error);
    throw error;
  }
}

// POST - Déclencher le nettoyage manuellement
export async function POST(request: Request) {
  try {
    // Vérifier si c'est un appel autorisé (vous pouvez ajouter une authentification ici)
    const body = await request.json();
    const { secret } = body;

    // Vérification simple avec une clé secrète (à configurer dans vos variables d'environnement)
    if (secret !== process.env.CLEANUP_SECRET) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const result = await cleanupOldNotifications();

    return NextResponse.json({
      message: "Nettoyage des notifications terminé avec succès",
      ...result
    });
  } catch (error) {
    console.error("Erreur lors du nettoyage:", error);
    return NextResponse.json(
      { error: "Erreur lors du nettoyage des notifications" },
      { status: 500 }
    );
  }
}

// GET - Obtenir les statistiques de nettoyage
export async function GET() {
  try {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Compter les notifications qui seront supprimées
    const notificationsToDelete = await prisma.notification.count({
      where: {
        createdAt: {
          lt: fifteenDaysAgo
        }
      }
    });

    // Statistiques générales
    const totalNotifications = await prisma.notification.count();
    const unreadNotifications = await prisma.notification.count({
      where: { read: false }
    });

    return NextResponse.json({
      cleanupInfo: {
        cutoffDate: fifteenDaysAgo.toISOString(),
        notificationsToDelete,
        daysOld: 15
      },
      stats: {
        total: totalNotifications,
        unread: unreadNotifications,
        read: totalNotifications - unreadNotifications
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
} 