import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import { generateAISummary } from '@/lib/ai';
import { sendCourseCompletionEmail } from '@/lib/email';
import { generateCertificateNumber, formatTimeSpent } from '@/lib/utils';

const MILESTONE_PERCENTAGES = [25, 50, 75, 100];

// Fonction pour générer le rapport général de fin de cours
async function generateFinalCourseReport(userId: string, courseId: number) {
  try {
    // Récupérer toutes les données du cours
    const courseProgress = await prisma.user_course_progress.findFirst({
      where: { userId, courseId },
      include: {
        milestones: {
          orderBy: { percentage: 'asc' }
        },
        reports: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!courseProgress) {
      throw new Error('Progression du cours non trouvée');
    }

    // Récupérer les informations du cours
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      throw new Error('Cours non trouvé');
    }

    // Récupérer les informations de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Préparer les données pour l'IA
    const milestonesData = courseProgress.milestones.map(m => ({
      percentage: m.percentage,
      learningSummary: m.learningSummary,
      keyConcepts: m.keyConcepts ? JSON.parse(m.keyConcepts) : [],
      challenges: m.challenges,
      nextSteps: m.nextSteps,
      notesAtMilestone: m.notesAtMilestone,
      timeSpentAtMilestone: m.timeSpentAtMilestone,
      positionAtMilestone: m.positionAtMilestone,
      completedAt: m.completedAt
    }));

    // Calculer les statistiques globales
    const totalTimeSpent = courseProgress.timeSpent || 0;
    const averageTimePerMilestone = totalTimeSpent / milestonesData.length;
    const allKeyConcepts = milestonesData.flatMap(m => m.keyConcepts);
    const uniqueConcepts = [...new Set(allKeyConcepts)];
    const totalNotes = milestonesData.filter(m => m.notesAtMilestone).length;

    // Générer le prompt pour le rapport général
    const finalReportPrompt = `
      En tant qu'expert pédagogique et mentor en apprentissage, génère un RAPPORT GÉNÉRAL DE FIN DE COURS complet et structuré pour l'apprenant.

      === INFORMATIONS DU COURS ===
      Titre du cours : ${course.title}
      Institution : ${course.institution}
      Niveau : ${course.level_normalized}
      Durée estimée : ${course.duration} heures
      Description : ${course.description}

      === PROGRESSION GLOBALE ===
      Temps total passé : ${totalTimeSpent} minutes (${(totalTimeSpent / 60).toFixed(1)} heures)
      Temps moyen par palier : ${averageTimePerMilestone.toFixed(0)} minutes
      Nombre total de concepts maîtrisés : ${uniqueConcepts.length}
      Nombre de paliers avec notes personnelles : ${totalNotes}
      Date de début : ${courseProgress.startedAt?.toLocaleDateString()}
      Date de fin : ${courseProgress.completedAt?.toLocaleDateString()}

      === DONNÉES DÉTAILLÉES PAR PALIER ===
      ${milestonesData.map(m => `
      **Palier ${m.percentage}%** (${m.completedAt?.toLocaleDateString()})
      - Résumé d'apprentissage : ${m.learningSummary}
      - Concepts clés : ${m.keyConcepts.join(', ')}
      - Difficultés : ${m.challenges}
      - Prochaines étapes prévues : ${m.nextSteps}
      - Position : ${m.positionAtMilestone}
      - Temps passé : ${m.timeSpentAtMilestone} minutes
      - Notes personnelles : ${m.notesAtMilestone || 'Aucune'}
      `).join('\n')}

      === INSTRUCTIONS POUR LE RAPPORT GÉNÉRAL ===

      Génère un rapport structuré et enrichi qui inclut :

      **1. RÉSUMÉ EXÉCUTIF**
      - Synthèse de l'accomplissement global
      - Temps d'investissement et efficacité
      - Progression et rythme d'apprentissage

      **2. COURS COMPLET SUR CE QUI A ÉTÉ APPRIS**
      - Module 1 : [Concepts fondamentaux du palier 25%]
      - Module 2 : [Concepts intermédiaires du palier 50%]
      - Module 3 : [Concepts avancés du palier 75%]
      - Module 4 : [Concepts experts du palier 100%]
      
      Chaque module doit inclure :
      * Explication détaillée des concepts
      * Pourquoi ces concepts sont importants
      * Exemples concrets et applications pratiques
      * Liens avec les notes personnelles de l'apprenant
      * Questions de validation pour vérifier la compréhension

      **3. ANALYSE DES COMPÉTENCES ACQUISES**
      - Compétences techniques maîtrisées
      - Compétences transversales développées
      - Points forts identifiés
      - Domaines d'amélioration

      **4. JOURNEY D'APPRENTISSAGE**
      - Évolution de la compréhension
      - Défis surmontés et stratégies utilisées
      - Moments clés d'apprentissage
      - Progression personnelle

      **5. RESSOURCES ET RÉFÉRENCES**
      - Concepts clés à retenir
      - Ressources pour approfondir
      - Liens utiles et références
      - Conseils pour maintenir les compétences

      **6. RECOMMANDATIONS POUR LA SUITE**
      - Prochaines étapes recommandées
      - Cours complémentaires suggérés
      - Projets pratiques à entreprendre
      - Stratégies de consolidation

      **7. PORTFOLIO DE COMPÉTENCES**
      - Liste complète des compétences acquises
      - Niveau de maîtrise pour chaque compétence
      - Exemples de mise en pratique
      - Certifications ou validations possibles

      **Important** :
      - Le rapport doit être éducatif et servir de cours de révision
      - Inclure des explications détaillées pour chaque concept
      - Faire des liens entre les différents paliers
      - Utiliser les notes personnelles pour personnaliser le contenu
      - Structurer le contenu de manière progressive et logique
      - Inclure des exercices de validation et des questions de réflexion
    `;

    const finalReport = await generateAISummary(finalReportPrompt);

    // Sauvegarder le rapport général
    const generalReport = await prisma.course_report.create({
      data: {
        userId,
        courseId,
        progressId: courseProgress.id,
        title: `Rapport Général de Fin de Cours - ${course.title}`,
        type: 'final_course_summary',
        milestonePercentage: 100,
        summary: finalReport.summary,
        keyPoints: JSON.stringify(finalReport.keyPoints),
        recommendations: finalReport.recommendations,
        insights: finalReport.insights
      }
    });

    // Générer un numéro de certification temporaire
    const certificateNumber = generateCertificateNumber();
    const formattedTimeSpent = formatTimeSpent(totalTimeSpent);
    const completionDate = courseProgress.completedAt || new Date();

    // Sauvegarder la certification en base de données
    const certification = await prisma.certification.create({
      data: {
        userId,
        courseId,
        progressId: courseProgress.id,
        title: `Certification - ${course.title}`,
        description: `Certification obtenue pour la complétion du cours "${course.title}"`,
        certificateNumber,
        courseTitle: course.title,
        institution: course.institution || 'Institution non spécifiée',
        level: course.level_normalized,
        duration: course.duration,
        timeSpent: totalTimeSpent,
        completionDate: completionDate,
        status: "active",
        isVerified: true
      }
    });

    // Mettre à jour le compteur de certifications de l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalCertifications: {
          increment: 1
        }
      }
    });

    // Envoyer l'email de félicitations
    const certificateUrl = `${process.env.NEXTAUTH_URL}/dashboard/certifications`;
    
    console.log('🔍 DEBUG: Tentative d\'envoi d\'email de félicitations');
    console.log('📧 Email utilisateur:', user.email);
    console.log('🔑 RESEND_API_KEY configurée:', !!process.env.RESEND_API_KEY);
    console.log('🌐 NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    
    if (user.email) {
      try {
        console.log('📤 Envoi de l\'email de félicitations...');
        await sendCourseCompletionEmail({
          email: user.email,
          name: user.name || 'Apprenant',
          courseTitle: course.title,
          institution: course.institution || 'Institution non spécifiée',
          certificateUrl,
          completionDate: completionDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          timeSpent: formattedTimeSpent,
          certificateNumber
        });
        console.log('✅ Email de félicitations envoyé avec succès');
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de félicitations:', emailError);
        // Ne pas faire échouer toute l'opération si l'email échoue
      }
    } else {
      console.log('⚠️ Aucun email trouvé pour l\'utilisateur, email non envoyé');
    }

    return { generalReport, certificateNumber };
  } catch (error) {
    console.error('Erreur lors de la génération du rapport général:', error);
    throw error;
  }
}

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

      // Générer un rapport général de fin de cours
      await generateFinalCourseReport(session.user.id, parseInt(courseId));
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