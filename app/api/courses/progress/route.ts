import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Récupérer la progression d'un cours
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const progress = await prisma.user_course_progress.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      },
      include: {
        course: true
      }
    });

    return NextResponse.json(progress || { status: "not_started" });
  } catch (error) {
    console.error("Erreur lors de la récupération de la progression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Créer ou mettre à jour la progression
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      courseId, 
      status, 
      progressPercentage, 
      currentPosition, 
      timeSpent,
      notes,
      rating,
      difficulty,
      review
    } = body;

    if (!courseId) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Empêcher la création d'enregistrements avec le statut "not_started"
    if (status === "not_started") {
      return NextResponse.json({ 
        error: "Impossible de créer un enregistrement avec le statut 'not_started'" 
      }, { status: 400 });
    }

    // Validation pour le statut "completed" - vérifier que tous les paliers sont validés
    if (status === "completed") {
      const milestones = await prisma.milestone.findMany({
        where: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      });

      const requiredMilestones = [25, 50, 75, 100];
      const completedMilestones = milestones
        .filter(m => m.isCompleted)
        .map(m => m.percentage);

      const missingMilestones = requiredMilestones.filter(
        p => !completedMilestones.includes(p)
      );

      if (missingMilestones.length > 0) {
        return NextResponse.json({
          error: `Impossible de marquer le cours comme terminé. Paliers manquants : ${missingMilestones.join('%, ')}%. Vous devez valider tous les paliers avant de terminer le cours.`,
          missingMilestones,
          requiredMilestones,
          completedMilestones
        }, { status: 400 });
      }
    }

    // Vérifier si le cours existe
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    const now = new Date();
    const updateData: any = {
      status,
      lastActivityAt: now,
      updatedAt: now
    };

    // Ajouter les champs optionnels s'ils sont fournis
    if (progressPercentage !== undefined) updateData.progressPercentage = progressPercentage;
    if (currentPosition !== undefined) updateData.currentPosition = currentPosition;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (notes !== undefined) updateData.notes = notes;
    if (rating !== undefined) updateData.rating = rating;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (review !== undefined) updateData.review = review;

    // Gérer les dates spéciales selon le statut
    if (status === "in_progress" && !body.startedAt) {
      updateData.startedAt = now;
    } else if (status === "completed") {
      updateData.completedAt = now;
      updateData.completionDate = now;
    }

    const progress = await prisma.user_course_progress.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      },
      update: updateData,
      create: {
        userId: user.id,
        courseId: parseInt(courseId),
        status,
        progressPercentage: progressPercentage || 0,
        currentPosition: currentPosition || null,
        timeSpent: timeSpent || 0,
        notes: notes || null,
        rating: rating || null,
        difficulty: difficulty || null,
        review: review || null,
        startedAt: status === "in_progress" ? now : null,
        completedAt: status === "completed" ? now : null,
        completionDate: status === "completed" ? now : null,
        lastActivityAt: now,
        favorite: false
      },
      include: {
        course: true
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la progression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Mettre à jour les notes et évaluations
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, notes, rating, difficulty, review } = body;

    if (!courseId) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (notes !== undefined) updateData.notes = notes;
    if (rating !== undefined) updateData.rating = rating;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (review !== undefined) updateData.review = review;

    const progress = await prisma.user_course_progress.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      },
      data: updateData,
      include: {
        course: true
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH - Mettre à jour les favoris et la progression
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      courseId, 
      favorite,
      status,
      progressPercentage,
      currentPosition,
      timeSpent,
      notes,
      rating,
      difficulty,
      review
    } = body;

    if (!courseId) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Empêcher la mise à jour vers le statut "not_started"
    if (status === "not_started") {
      return NextResponse.json({ 
        error: "Impossible de mettre à jour vers le statut 'not_started'. Utilisez DELETE pour supprimer la progression." 
      }, { status: 400 });
    }

    // Validation pour le statut "completed" - vérifier que tous les paliers sont validés
    if (status === "completed") {
      const milestones = await prisma.milestone.findMany({
        where: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      });

      const requiredMilestones = [25, 50, 75, 100];
      const completedMilestones = milestones
        .filter(m => m.isCompleted)
        .map(m => m.percentage);

      const missingMilestones = requiredMilestones.filter(
        p => !completedMilestones.includes(p)
      );

      if (missingMilestones.length > 0) {
        return NextResponse.json({
          error: `Impossible de marquer le cours comme terminé. Paliers manquants : ${missingMilestones.join('%, ')}%. Vous devez valider tous les paliers avant de terminer le cours.`,
          missingMilestones,
          requiredMilestones,
          completedMilestones
        }, { status: 400 });
      }
    }

    const now = new Date();
    const updateData: any = {
      updatedAt: now
    };

    // Gérer les favoris
    if (favorite !== undefined) {
      updateData.favorite = Boolean(favorite);
    }

    // Gérer les changements de statut et progression
    if (status !== undefined) {
      updateData.status = status;
      updateData.lastActivityAt = now;
      
      // Gérer les dates spéciales selon le statut
      if (status === "in_progress") {
        updateData.startedAt = now;
      } else if (status === "completed") {
        updateData.completedAt = now;
        updateData.completionDate = now;
      }
    }

    // Ajouter les autres champs de progression s'ils sont fournis
    if (progressPercentage !== undefined) updateData.progressPercentage = progressPercentage;
    if (currentPosition !== undefined) updateData.currentPosition = currentPosition;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (notes !== undefined) updateData.notes = notes;
    if (rating !== undefined) updateData.rating = rating;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (review !== undefined) updateData.review = review;

    const progress = await prisma.user_course_progress.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      },
      data: updateData,
      include: {
        course: true
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE - Supprimer la progression
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    await prisma.user_course_progress.delete({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: parseInt(courseId)
        }
      }
    });

    return NextResponse.json({ message: "Progression supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la progression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 