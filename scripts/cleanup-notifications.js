const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupOldNotifications() {
  try {
    console.log('🧹 Début du nettoyage des notifications...');
    
    // Calculer la date limite (15 jours en arrière)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    console.log(`📅 Suppression des notifications antérieures au: ${fifteenDaysAgo.toISOString()}`);
    
    // Supprimer les notifications anciennes
    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: fifteenDaysAgo
        }
      }
    });
    
    console.log(`✅ ${result.count} notification(s) supprimée(s) avec succès`);
    
    // Statistiques
    const totalNotifications = await prisma.notification.count();
    const unreadNotifications = await prisma.notification.count({
      where: { read: false }
    });
    
    console.log(`📊 Statistiques après nettoyage:`);
    console.log(`   - Total: ${totalNotifications} notification(s)`);
    console.log(`   - Non lues: ${unreadNotifications} notification(s)`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des notifications:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le nettoyage si le script est appelé directement
if (require.main === module) {
  cleanupOldNotifications()
    .then(() => {
      console.log('🎉 Nettoyage terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { cleanupOldNotifications }; 