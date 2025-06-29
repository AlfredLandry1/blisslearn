import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 Test de l\'authentification et du champ provider...');
    
    // Récupérer tous les utilisateurs avec leurs informations
    const users = await prisma.user.findMany({
      include: {
        accounts: true
      }
    });

    console.log(`📊 Nombre total d'utilisateurs: ${users.length}`);

    for (const user of users) {
      console.log('\n👤 Utilisateur:', {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        hasPassword: !!user.password,
        accounts: user.accounts.map(acc => ({
          provider: acc.provider,
          type: acc.type
        }))
      });
    }

    // Vérifier spécifiquement les utilisateurs Google
    const googleUsers = await prisma.user.findMany({
      where: {
        accounts: {
          some: {
            provider: 'google'
          }
        }
      },
      include: {
        accounts: true
      }
    });

    console.log(`\n🔍 Utilisateurs avec des comptes Google: ${googleUsers.length}`);
    
    for (const user of googleUsers) {
      console.log(`✅ ${user.email}: provider = "${user.provider}"`);
    }

    // Vérifier les utilisateurs sans provider
    const usersWithoutProvider = await prisma.user.findMany({
      where: {
        provider: null
      }
    });

    if (usersWithoutProvider.length > 0) {
      console.log(`\n⚠️  Utilisateurs sans provider: ${usersWithoutProvider.length}`);
      for (const user of usersWithoutProvider) {
        console.log(`❌ ${user.email}: provider = null`);
      }
    } else {
      console.log('\n✅ Tous les utilisateurs ont un provider défini !');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testAuth(); 