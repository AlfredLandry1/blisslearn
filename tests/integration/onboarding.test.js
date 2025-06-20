const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOnboarding() {
  try {
    console.log('🔍 Test de l\'état de l\'onboarding...\n');

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s):`);
    users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`);
    });

    // Vérifier les réponses d'onboarding
    console.log('\n🔍 Vérification des réponses d\'onboarding...');
    
    for (const user of users) {
      try {
        const onboarding = await prisma.$queryRaw`
          SELECT isCompleted FROM onboarding_responses WHERE userId = ${user.id} LIMIT 1
        `;
        
        const isCompleted = (onboarding[0]?.isCompleted ?? false);
        console.log(`  - ${user.email}: onboarding ${isCompleted ? '✅ complété' : '❌ non complété'}`);
      } catch (error) {
        console.log(`  - ${user.email}: ❌ erreur lors de la vérification - ${error.message}`);
      }
    }

    // Vérifier la structure de la table
    console.log('\n🔍 Structure de la table onboarding_responses...');
    try {
      const tableInfo = await prisma.$queryRaw`
        DESCRIBE onboarding_responses
      `;
      console.log('  Structure de la table:');
      tableInfo.forEach(column => {
        console.log(`    - ${column.Field}: ${column.Type}`);
      });
    } catch (error) {
      console.log(`  ❌ Erreur lors de la vérification de la structure: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOnboarding(); 