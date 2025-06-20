const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createOnboardingResponse() {
  try {
    console.log('🔍 Création d\'une réponse d\'onboarding...\n');

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: 'alfred@mail.com' }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log(`📝 Création de l'onboarding pour: ${user.email} (ID: ${user.id})`);

    // Créer une réponse d'onboarding complétée
    const onboardingResponse = await prisma.onboarding_responses.create({
      data: {
        userId: user.id,
        learningObjectives: 'Développement web, React, Next.js',
        domainsOfInterest: 'Programmation, Design, Marketing',
        skillLevel: 'Intermédiaire',
        weeklyHours: 10,
        preferredPlatforms: 'Web, Mobile',
        courseFormat: 'Vidéo, Texte, Exercices',
        courseDuration: '3-6 mois',
        courseLanguage: 'Français',
        isCompleted: true,
      }
    });

    console.log('✅ Réponse d\'onboarding créée avec succès:');
    console.log(JSON.stringify(onboardingResponse, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOnboardingResponse(); 