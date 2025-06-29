import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH - Marquer une notification comme lue
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { read } = body;

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification introuvable" }, { status: 404 });
    }

    // Mettre à jour la notification
    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: {
        read: read !== undefined ? read : true,
        readAt: read ? new Date() : null
      }
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une notification spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification introuvable" }, { status: 404 });
    }

    // Supprimer la notification
    await prisma.notification.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la notification" },
      { status: 500 }
    );
  }
} 