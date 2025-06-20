const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupAuth() {
  try {
    console.log('🧹 Nettoyage des données d\'authentification...\n');

    // Supprimer l'utilisateur Google corrompu
    const userToDelete = await prisma.user.findUnique({
      where: { email: 'alfredlandrytalom2004@gmail.com' }
    });

    if (userToDelete) {
      console.log(`🗑️ Suppression de l'utilisateur: ${userToDelete.email}`);
      
      // Supprimer d'abord les réponses d'onboarding
      try {
        await prisma.onboarding_responses.deleteMany({
          where: { userId: userToDelete.id }
        });
        console.log('✅ Réponses d\'onboarding supprimées');
      } catch (error) {
        console.log('ℹ️ Aucune réponse d\'onboarding à supprimer');
      }

      // Supprimer les comptes
      try {
        await prisma.account.deleteMany({
          where: { userId: userToDelete.id }
        });
        console.log('✅ Comptes supprimés');
      } catch (error) {
        console.log('ℹ️ Aucun compte à supprimer');
      }

      // Supprimer les sessions
      try {
        await prisma.session.deleteMany({
          where: { userId: userToDelete.id }
        });
        console.log('✅ Sessions supprimées');
      } catch (error) {
        console.log('ℹ️ Aucune session à supprimer');
      }

      // Supprimer l'utilisateur
      await prisma.user.delete({
        where: { id: userToDelete.id }
      });
      console.log('✅ Utilisateur supprimé');
    } else {
      console.log('ℹ️ Aucun utilisateur à supprimer');
    }

    console.log('\n✅ Nettoyage terminé !');
    console.log('🔄 Tu peux maintenant tester la connexion Google à nouveau');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAuth(); 