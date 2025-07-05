import { NextRequest, NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// PATCH - Marquer une notification comme lue
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // Vérification plus robuste de la session
    if (!session?.user?.email || !session?.user?.id) {
      console.error('Session invalide pour PATCH:', { 
        hasSession: !!session, 
        hasUser: !!session?.user, 
        hasEmail: !!session?.user?.email, 
        hasId: !!session?.user?.id 
      });
      return NextResponse.json({ error: 'Non autorisé - Session invalide' }, { status: 401 });
    }

    const notificationId = id;
    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification invalide' }, { status: 400 });
    }

    const body = await request.json();
    const { read } = body;

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await withRetry(() => 
      prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: session.user.id
        }
      })
    );

    if (!notification) {
      console.log('Notification non trouvée pour PATCH:', { 
        notificationId, 
        userId: session.user.id,
        availableNotifications: await prisma.notification.findMany({
          where: { userId: session.user.id },
          select: { id: true, title: true }
        })
      });
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Mettre à jour la notification
    const updatedNotification = await withRetry(() =>
      prisma.notification.update({
        where: { id: notificationId },
        data: {
          read: read !== undefined ? read : notification.read,
          updatedAt: new Date()
        }
      })
    );

    return NextResponse.json({
      notification: updatedNotification,
      message: 'Notification mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur lors de la mise à jour',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// DELETE - Supprimer une notification spécifique
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // Vérification plus robuste de la session
    if (!session?.user?.email || !session?.user?.id) {
      console.error('Session invalide:', { 
        hasSession: !!session, 
        hasUser: !!session?.user, 
        hasEmail: !!session?.user?.email, 
        hasId: !!session?.user?.id 
      });
      return NextResponse.json({ error: 'Non autorisé - Session invalide' }, { status: 401 });
    }

    const notificationId = id;
    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification invalide' }, { status: 400 });
    }

    console.log('Tentative de suppression de notification:', { 
      notificationId, 
      userId: session.user.id 
    });

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await withRetry(() =>
      prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: session.user.id
        }
      })
    );

    if (!notification) {
      console.log('Notification non trouvée:', { notificationId, userId: session.user.id });
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Supprimer la notification
    await withRetry(() =>
      prisma.notification.delete({
        where: { id: notificationId }
      })
    );

    console.log('Notification supprimée avec succès:', notificationId);

    return NextResponse.json({
      message: 'Notification supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur lors de la suppression',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 