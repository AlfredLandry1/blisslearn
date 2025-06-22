import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { generateAISummary } from '@/lib/ai';

const MILESTONE_PERCENTAGES = [25, 50, 75, 100];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'ID du cours requis' }, { status: 400 });
    }

    // Récupérer la progression du cours
    const progress = await prisma.user_course_progress.findFirst({
      where: {
        userId: session.user.id,
        courseId: parseInt(courseId)
      },
      include: {
        milestones: {
          orderBy: { percentage: 'asc' }
        },
        reports: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Si pas de progression ou cours non commencé, retourner une réponse appropriée
    if (!progress || progress.status === 'not_started') {
      return NextResponse.json({
        milestones: [],
        reports: [],
        currentProgress: 0,
        message: 'Ce cours n\'est pas encore dans vos cours en cours. Aucune statistique disponible.',
        courseNotStarted: true
      });
    }

    // Créer les paliers manquants seulement si le cours est en cours
    const existingMilestones = progress.milestones.map(m => m.percentage);
    const missingMilestones = MILESTONE_PERCENTAGES.filter(p => !existingMilestones.includes(p));

    if (missingMilestones.length > 0) {
      await Promise.all(
        missingMilestones.map(percentage =>
          prisma.milestone.create({
            data: {
              userId: session.user.id,
              courseId: parseInt(courseId),
              progressId: progress.id,
              percentage
            }
          })
        )
      );
    }

    // Récupérer les paliers mis à jour
    const updatedMilestones = await prisma.milestone.findMany({
      where: {
        userId: session.user.id,
        courseId: parseInt(courseId)
      },
      orderBy: { percentage: 'asc' }
    });

    return NextResponse.json({
      milestones: updatedMilestones,
      reports: progress.reports,
      currentProgress: progress.progressPercentage || 0
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des paliers:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, percentage, formData } = body;

    if (!courseId || !percentage || !formData) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier que le palier précédent est validé
    const previousMilestone = await prisma.milestone.findFirst({
      where: {
        userId: session.user.id,
        courseId: parseInt(courseId),
        percentage: {
          lt: percentage
        },
        isCompleted: false
      },
      orderBy: { percentage: 'desc' }
    });

    if (previousMilestone) {
      return NextResponse.json({ 
        error: `Vous devez d'abord valider le palier ${previousMilestone.percentage}%` 
      }, { status: 400 });
    }

    // Récupérer ou créer le palier
    let milestone = await prisma.milestone.findFirst({
      where: {
        userId: session.user.id,
        courseId: parseInt(courseId),
        percentage
      }
    });

    if (!milestone) {
      const progress = await prisma.user_course_progress.findFirst({
        where: {
          userId: session.user.id,
          courseId: parseInt(courseId)
        }
      });

      if (!progress) {
        return NextResponse.json({ error: 'Progression non trouvée' }, { status: 404 });
      }

      milestone = await prisma.milestone.create({
        data: {
          userId: session.user.id,
          courseId: parseInt(courseId),
          progressId: progress.id,
          percentage
        }
      });
    }

    // Mettre à jour le palier avec les données du formulaire
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        validatedAt: new Date(),
        timeSpentAtMilestone: formData.timeSpentAtMilestone,
        positionAtMilestone: formData.positionAtMilestone,
        notesAtMilestone: formData.notesAtMilestone,
        learningSummary: formData.learningSummary,
        keyConcepts: JSON.stringify(formData.keyConcepts),
        challenges: formData.challenges,
        nextSteps: formData.nextSteps
      }
    });

    // Mettre à jour la progression globale
    await prisma.user_course_progress.updateMany({
      where: {
        userId: session.user.id,
        courseId: parseInt(courseId)
      },
      data: {
        progressPercentage: percentage,
        timeSpent: formData.timeSpentAtMilestone,
        currentPosition: formData.positionAtMilestone,
        lastActivityAt: new Date()
      }
    });

    // Si c'est le palier 100%, marquer automatiquement le cours comme terminé
    if (percentage === 100) {
      await prisma.user_course_progress.updateMany({
        where: {
          userId: session.user.id,
          courseId: parseInt(courseId)
        },
        data: {
          status: "completed",
          completedAt: new Date(),
          completionDate: new Date()
        }
      });
    }

    // Récupérer les notes personnelles du cours pour enrichir le contexte
    const courseProgress = await prisma.user_course_progress.findFirst({
      where: {
        userId: session.user.id,
        courseId: parseInt(courseId)
      }
    });

    // Générer le rapport IA avec contexte enrichi
    const aiPrompt = `
      En tant qu'expert en apprentissage et mentor pédagogique, génère un rapport détaillé et personnalisé basé sur les informations suivantes :
      
      === INFORMATIONS D'APPRENTISSAGE ===
      Résumé de l'apprentissage : ${formData.learningSummary}
      Concepts clés maîtrisés : ${formData.keyConcepts.join(', ')}
      Difficultés rencontrées : ${formData.challenges}
      Prochaines étapes prévues : ${formData.nextSteps}
      
      === CONTEXTE DE PROGRESSION ===
      Position actuelle dans le cours : ${formData.positionAtMilestone}
      Temps total passé : ${formData.timeSpentAtMilestone} minutes
      Palier atteint : ${percentage}%
      
      === NOTES PERSONNELLES ===
      ${formData.notesAtMilestone ? `Notes personnelles de l'apprenant : ${formData.notesAtMilestone}` : 'Aucune note personnelle fournie'}
      
      === CONTEXTE GLOBAL DU COURS ===
      ${courseProgress?.notes ? `Notes générales du cours : ${courseProgress.notes}` : 'Aucune note générale disponible'}
      Temps total passé sur le cours : ${courseProgress?.timeSpent || 0} minutes
      Statut du cours : ${courseProgress?.status || 'in_progress'}
      
      === INSTRUCTIONS POUR LE RAPPORT ===
      
      Génère un rapport structuré et personnalisé qui inclut :
      
      1. **RÉSUMÉ PERSONNALISÉ** : Un résumé de ce qui a été accompli, en tenant compte du style d'apprentissage et des notes personnelles
      
      2. **CE QUE VOUS DEVRIEZ SAVOIR** : Une section détaillée qui explique "Ce que vous devriez savoir sur [sujet] en fonction de votre progression". Cette section doit :
         - Lister les connaissances essentielles acquises à ce palier
         - Expliquer pourquoi ces concepts sont importants
         - Faire des liens avec vos notes personnelles et votre style d'apprentissage
         - Donner des exemples concrets basés sur votre progression
         - Inclure des points de validation pour vous assurer que vous maîtrisez ces concepts
      
      3. **POINTS CLÉS À RETENIR** : Les concepts essentiels maîtrisés, avec des liens vers les notes personnelles si pertinentes
      
      4. **ANALYSE DES DIFFICULTÉS** : Une analyse approfondie des défis rencontrés et des stratégies pour les surmonter
      
      5. **RECOMMANDATIONS PERSONNALISÉES** : Des conseils adaptés basés sur le profil d'apprentissage, le temps passé et les notes
      
      6. **INSIGHTS ET OBSERVATIONS** : Des observations sur les patterns d'apprentissage, la progression et les points forts identifiés
      
      7. **STRATÉGIES POUR LA SUITE** : Des suggestions concrètes pour optimiser l'apprentissage dans les prochaines étapes
      
      **Important** : 
      - La section "CE QUE VOUS DEVRIEZ SAVOIR" doit être particulièrement détaillée et personnalisée
      - Utilise les notes personnelles pour adapter le contenu à votre style d'apprentissage
      - Inclus des questions de validation pour vous aider à vérifier votre compréhension
      - Fais des liens entre les concepts appris et leur application pratique
    `;

    const aiReport = await generateAISummary(aiPrompt);

    // Sauvegarder le rapport IA
    const report = await prisma.course_report.create({
      data: {
        userId: session.user.id,
        courseId: parseInt(courseId),
        progressId: milestone.progressId,
        title: `Rapport de progression - ${percentage}%`,
        type: 'milestone_summary',
        milestonePercentage: percentage,
        summary: aiReport.summary,
        keyPoints: JSON.stringify(aiReport.keyPoints),
        recommendations: aiReport.recommendations,
        insights: aiReport.insights
      }
    });

    return NextResponse.json({
      milestone: updatedMilestone,
      report,
      message: `Palier ${percentage}% validé avec succès !`
    });

  } catch (error) {
    console.error('Erreur lors de la validation du palier:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 