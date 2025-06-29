import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';

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

    const milestoneId = id;
    if (!milestoneId) {
      return NextResponse.json({ error: 'ID de palier invalide' }, { status: 400 });
    }

    const body = await request.json();
    const { 
      timeSpentAtMilestone, 
      positionAtMilestone, 
      notesAtMilestone,
      lastUpdatedAt 
    } = body;

    // Vérifier que le palier appartient à l'utilisateur
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        userId: session.user.id
      }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Palier non trouvé' }, { status: 404 });
    }

    // Mettre à jour le palier avec les données de progression en cours
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        timeSpentAtMilestone: timeSpentAtMilestone || milestone.timeSpentAtMilestone,
        positionAtMilestone: positionAtMilestone || milestone.positionAtMilestone,
        notesAtMilestone: notesAtMilestone || milestone.notesAtMilestone,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      milestone: updatedMilestone,
      message: 'Palier mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du palier:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const milestoneId = id;
    if (!milestoneId) {
      return NextResponse.json({ error: 'ID de palier invalide' }, { status: 400 });
    }

    // Récupérer le palier avec ses détails
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        userId: session.user.id
      }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Palier non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ milestone });

  } catch (error) {
    console.error('Erreur lors de la récupération du palier:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 