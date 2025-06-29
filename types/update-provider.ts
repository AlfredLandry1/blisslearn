import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserProviders() {
  try {
    console.log('🔍 Recherche des utilisateurs avec des comptes Google...');
    
    // Récupérer tous les utilisateurs qui ont un compte Google
    const usersWithGoogleAccounts = await prisma.user.findMany({
      where: {
        account: {
          some: {
            provider: 'google'
          }
        }
      },
      include: {
        account: true
      }
    });

    console.log(`📊 Trouvé ${usersWithGoogleAccounts.length} utilisateurs avec des comptes Google`);

    // Mettre à jour le champ provider pour chaque utilisateur
    for (const user of usersWithGoogleAccounts) {
      const hasGoogleAccount = user.account.some(acc => acc.provider === 'google');
      
      if (hasGoogleAccount) {
        await prisma.user.update({
          where: { id: user.id },
          data: { provider: 'google' }
        });
        
        console.log(`✅ Mis à jour l'utilisateur ${user.email} avec provider: google`);
      }
    }

    // Mettre à jour les utilisateurs avec des mots de passe (credentials)
    const usersWithPasswords = await prisma.user.findMany({
      where: {
        password: {
          not: null
        },
        provider: null
      }
    });

    console.log(`📊 Trouvé ${usersWithPasswords.length} utilisateurs avec des mots de passe`);

    for (const user of usersWithPasswords) {
      await prisma.user.update({
        where: { id: user.id },
        data: { provider: 'credentials' }
      });
      
      console.log(`✅ Mis à jour l'utilisateur ${user.email} avec provider: credentials`);
    }

    console.log('🎉 Mise à jour terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateUserProviders(); 