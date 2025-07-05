import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// Fonction pour supprimer automatiquement les anciennes notifications
async function cleanupOldNotifications() {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  try {
    await withRetry(() =>
      prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: fifteenDaysAgo
          }
        }
      })
    );
  } catch (error) {
    console.error("Erreur lors du nettoyage des notifications:", error);
  }
}

// GET - Récupérer les notifications d'un utilisateur
export async function GET(request: Request) {
  try {
    console.log("🔍 Tentative de récupération des notifications...");
    
    const session = await getServerSession(authOptions);
    console.log("Session récupérée:", { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      email: session?.user?.email,
      id: session?.user?.id
    });
    
    if (!session?.user?.email) {
      console.log("❌ Utilisateur non authentifié");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log("❌ Utilisateur introuvable:", session.user.email);
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    console.log("✅ Utilisateur trouvé:", user.email, user.id);

    // Nettoyer les anciennes notifications
    // await cleanupOldNotifications();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;
    const unreadOnly = searchParams.get('unread') === 'true';

    // Construire les conditions de filtrage
    const where: any = { userId: user.id };
    if (unreadOnly) {
      where.read = false;
    }

    console.log("🔍 Recherche des notifications avec filtres:", { userId: user.id, unreadOnly });

    // Récupérer les notifications avec pagination
    const [notifications, totalNotifications] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where })
    ]);

    const totalPages = Math.ceil(totalNotifications / limit);

    console.log(`✅ ${notifications.length} notifications trouvées sur ${totalNotifications} total pour userId=${user.id}`);

    return NextResponse.json({
      notifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalNotifications,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des notifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications", details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle notification
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { email: session.user.email! }
      })
    );

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Nettoyer les anciennes notifications
    // await cleanupOldNotifications();

    const body = await request.json();
    const { title, message, type, duration, actionUrl, actionText, metadata } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Message et type requis" }, { status: 400 });
    }

    const notification = await withRetry(() =>
      prisma.notification.create({
        data: {
          userId: user.id,
          title,
          message,
          type,
          duration,
          actionUrl,
          actionText,
          metadata: metadata ? JSON.stringify(metadata) : null,
        }
      })
    );

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la notification" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer toutes les notifications d'un utilisateur
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const readOnly = searchParams.get('read') === 'true';

    // Construire les conditions de suppression
    const where: any = { userId: user.id };
    if (readOnly) {
      where.read = true;
    }

    await prisma.notification.deleteMany({ where });

    return NextResponse.json({ message: "Notifications supprimées avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression des notifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression des notifications" },
      { status: 500 }
    );
  }
} 