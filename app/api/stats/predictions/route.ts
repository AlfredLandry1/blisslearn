import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import { generateAISummary } from '@/lib/ai';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer toutes les données de l'utilisateur pour l'analyse
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userCourseProgress: {
          include: {
            milestones: true,
            reports: true
          }
        },
        certifications: true,
        notifications: true
      }
    });

    if (!userData) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Analyser les patterns d'apprentissage
    const courseProgress = userData.userCourseProgress;
    const totalCourses = courseProgress.length;
    const completedCourses = courseProgress.filter((c: any) => c.status === 'completed').length;
    const inProgressCourses = courseProgress.filter((c: any) => c.status === 'in_progress').length;
    const totalTimeSpent = courseProgress.reduce((sum: number, c: any) => sum + (c.timeSpent || 0), 0);
    const averageProgress = courseProgress.length > 0 
      ? courseProgress.reduce((sum: number, c: any) => sum + (c.progressPercentage || 0), 0) / courseProgress.length 
      : 0;

    // Calculer les tendances récentes (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = courseProgress.filter((c: any) => 
      c.lastActivityAt && new Date(c.lastActivityAt) > thirtyDaysAgo
    );

    const recentTimeSpent = recentActivity.reduce((sum: number, c: any) => sum + (c.timeSpent || 0), 0);
    const recentProgress = recentActivity.length > 0 
      ? recentActivity.reduce((sum: number, c: any) => sum + (c.progressPercentage || 0), 0) / recentActivity.length 
      : 0;

    // Générer des prédictions avec l'IA
    const predictionPrompt = `
      En tant qu'expert en analyse de données d'apprentissage et en gamification, génère des prédictions motivantes et réalistes pour un apprenant basées sur ses données actuelles.

      === DONNÉES ACTUELLES DE L'UTILISATEUR ===
      - Nombre total de cours : ${totalCourses}
      - Cours terminés : ${completedCourses}
      - Cours en cours : ${inProgressCourses}
      - Temps total passé : ${totalTimeSpent} minutes (${(totalTimeSpent / 60).toFixed(1)} heures)
      - Progression moyenne : ${averageProgress.toFixed(1)}%
      - Activité récente (30 derniers jours) : ${recentActivity.length} cours actifs
      - Temps récent : ${recentTimeSpent} minutes
      - Progression récente : ${recentProgress.toFixed(1)}%
      - Certifications obtenues : ${userData.certifications.length}
      - Score d'onboarding : ${userData.onboardingCompleted ? 'Complété' : 'À compléter'}

      === INSTRUCTIONS POUR LES PRÉDICTIONS ===
      
      Génère des prédictions ENTHOUSIASTES et MOTIVANTES pour les 30 prochains jours, en format JSON :

      {
        "predictions": [
          {
            "day": 1,
            "hoursPredicted": number,
            "coursesCompleted": number,
            "certificationsEarned": number,
            "motivationalMessage": "string enthousiaste",
            "achievement": "string de réalisation",
            "confidence": number (0-100)
          }
        ],
        "trends": {
          "learningVelocity": "string (croissant/décroissant/stable)",
          "focusAreas": ["string"],
          "potentialBreakthroughs": ["string"],
          "gamificationTips": ["string"]
        },
        "goals": {
          "realisticGoal": "string",
          "stretchGoal": "string",
          "motivationalQuote": "string"
        }
      }

      **Important** :
      - Les prédictions doivent être ENTHOUSIASTES et GAMIFIÉES (style Duolingo)
      - Inclure des messages motivants et des "achievements" à débloquer
      - Baser les prédictions sur les patterns réels de l'utilisateur
      - Ajouter des éléments de surprise et de récompense
      - Utiliser un ton encourageant et positif
      - Inclure des conseils personnalisés pour améliorer les performances
    `;

    const aiResponse = await generateAISummary(predictionPrompt);
    
    // Parser la réponse JSON de l'IA
    let predictions;
    try {
      predictions = JSON.parse(aiResponse.summary);
    } catch (error) {
      // Fallback si l'IA ne retourne pas du JSON valide
      predictions = generateFallbackPredictions(userData, totalTimeSpent, averageProgress);
    }

    // Générer des données de graphique pour les prédictions
    const chartData = predictions.predictions.map((pred: any, index: number) => ({
      day: `J${index + 1}`,
      hours: pred.hoursPredicted,
      courses: pred.coursesCompleted,
      certifications: pred.certificationsEarned,
      confidence: pred.confidence
    }));

    return NextResponse.json({
      predictions: predictions.predictions,
      trends: predictions.trends,
      goals: predictions.goals,
      chartData,
      currentStats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalTimeSpent,
        averageProgress,
        recentActivity: recentActivity.length,
        recentTimeSpent,
        recentProgress
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération des prédictions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Fonction de fallback pour générer des prédictions basiques
function generateFallbackPredictions(userData: any, totalTimeSpent: number, averageProgress: number) {
  const baseHoursPerDay = Math.max(0.5, (totalTimeSpent / 60) / 30); // Heures moyennes par jour
  const learningMomentum = averageProgress > 50 ? 1.2 : 0.8; // Facteur de momentum
  
  const predictions = [];
  let cumulativeHours = 0;
  let cumulativeCourses = 0;
  let cumulativeCertifications = 0;

  for (let day = 1; day <= 30; day++) {
    // Prédictions avec variation réaliste
    const dailyHours = Math.max(0.1, baseHoursPerDay * learningMomentum * (0.8 + Math.random() * 0.4));
    cumulativeHours += dailyHours;
    
    // Cours complétés (probabilité basée sur la progression)
    const courseCompletionChance = (averageProgress / 100) * 0.1;
    if (Math.random() < courseCompletionChance) {
      cumulativeCourses += 1;
    }
    
    // Certifications (plus rares)
    const certificationChance = courseCompletionChance * 0.3;
    if (Math.random() < certificationChance) {
      cumulativeCertifications += 1;
    }

    predictions.push({
      day,
      hoursPredicted: Math.round(dailyHours * 10) / 10,
      coursesCompleted: cumulativeCourses,
      certificationsEarned: cumulativeCertifications,
      motivationalMessage: getMotivationalMessage(day, dailyHours),
      achievement: getAchievement(day, cumulativeHours),
      confidence: Math.min(95, 70 + (day * 0.8))
    });
  }

  return {
    predictions,
    trends: {
      learningVelocity: averageProgress > 50 ? "croissant" : "stable",
      focusAreas: ["Développement Web", "Frameworks", "Base de données"],
      potentialBreakthroughs: ["Maîtrise avancée", "Projets complexes", "Certifications"],
      gamificationTips: [
        "Maintenez votre streak quotidien !",
        "Débloquez de nouveaux badges",
        "Atteignez vos objectifs hebdomadaires"
      ]
    },
    goals: {
      realisticGoal: `Atteindre ${Math.round(cumulativeHours)}h d'apprentissage ce mois`,
      stretchGoal: `Terminer ${Math.round(cumulativeCourses + 2)} cours supplémentaires`,
      motivationalQuote: "Chaque jour d'apprentissage vous rapproche de vos rêves ! 🚀"
    }
  };
}

function getMotivationalMessage(day: number, hours: number): string {
  const messages = [
    "Excellent travail ! Vous maintenez un rythme impressionnant ! 🎯",
    "Votre persévérance commence à porter ses fruits ! 🌱",
    "Jour après jour, vous construisez votre expertise ! 💪",
    "Votre dévouement à l'apprentissage est inspirant ! ⭐",
    "Continuez sur cette lancée, vous êtes sur la bonne voie ! 🚀",
    "Chaque heure investie vous rapproche de vos objectifs ! 🎓",
    "Votre discipline d'apprentissage est remarquable ! 🔥",
    "Vous développez des compétences qui changeront votre vie ! 💎"
  ];
  return messages[day % messages.length];
}

function getAchievement(day: number, cumulativeHours: number): string {
  if (day === 7) return "🎉 Streak d'une semaine !";
  if (day === 14) return "🔥 Deux semaines de persévérance !";
  if (day === 21) return "⚡ Trois semaines d'excellence !";
  if (day === 30) return "🏆 Mois complet d'apprentissage !";
  if (cumulativeHours >= 50) return "📚 50h d'apprentissage atteintes !";
  if (cumulativeHours >= 100) return "🎓 100h d'expertise !";
  return "✨ Progression continue !";
} 