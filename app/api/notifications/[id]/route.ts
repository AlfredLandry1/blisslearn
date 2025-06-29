import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// PATCH - Marquer une notification comme lue
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const notificationId = id;
    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification invalide' }, { status: 400 });
    }

    const body = await request.json();
    const { read } = body;

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Mettre à jour la notification
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: read !== undefined ? read : notification.read,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      notification: updatedNotification,
      message: 'Notification mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une notification spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const notificationId = id;
    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification invalide' }, { status: 400 });
    }

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Supprimer la notification
    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({
      message: 'Notification supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 