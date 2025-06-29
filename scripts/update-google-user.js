const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateGoogleUser() {
  try {
    const email = 'alfredlandrytalom2004@gmail.com';
    
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé:', {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      provider: user.provider,
      accounts: user.accounts.map(acc => ({
        provider: acc.provider,
        type: acc.type
      }))
    });

    // Mettre à jour l'utilisateur pour marquer l'email comme vérifié
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        provider: 'google'
      }
    });

    console.log('✅ Utilisateur mis à jour:', {
      emailVerified: updatedUser.emailVerified,
      provider: updatedUser.provider
    });

    // Vérifier si un compte Google existe déjà
    const googleAccount = user.accounts.find(acc => acc.provider === 'google');
    
    if (!googleAccount) {
      console.log('⚠️ Aucun compte Google trouvé. L\'utilisateur devra se reconnecter avec Google.');
    } else {
      console.log('✅ Compte Google trouvé:', {
        provider: googleAccount.provider,
        type: googleAccount.type
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateGoogleUser(); 