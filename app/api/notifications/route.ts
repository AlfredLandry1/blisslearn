import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// Fonction pour supprimer automatiquement les anciennes notifications
async function cleanupOldNotifications() {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  try {
    await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: fifteenDaysAgo
        }
      }
    });
  } catch (error) {
    console.error("Erreur lors du nettoyage des notifications:", error);
  }
}

// GET - Récupérer les notifications d'un utilisateur
export async function GET(request: NextRequest) {
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

    // Nettoyer les anciennes notifications
    await cleanupOldNotifications();

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
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle notification
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, message, type, duration, actionUrl, actionText, metadata } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Message et type requis" }, { status: 400 });
    }

    // Nettoyer les anciennes notifications
    await cleanupOldNotifications();

    const notification = await prisma.notification.create({
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
    });

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
export async function DELETE(request: NextRequest) {
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