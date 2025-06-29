#!/usr/bin/env node

/**
 * Script de nettoyage automatique des comptes non vérifiés
 * À exécuter via un cron job hebdomadaire
 * 
 * Exemple de cron job (tous les dimanches à 2h du matin) :
 * 0 2 * * 0 /usr/bin/node /path/to/blisslearn/scripts/cleanup-unverified-users.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupUnverifiedUsers() {
  try {
    console.log('🧹 Début du nettoyage automatique des comptes non vérifiés...');
    
    // Calculer la date limite (7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    console.log(`📅 Suppression des comptes créés avant : ${sevenDaysAgo.toISOString()}`);
    
    // Supprimer les comptes non vérifiés de plus de 7 jours
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        emailVerified: null,
        createdAt: {
          lt: sevenDaysAgo
        },
        // Exclure l'admin de test
        email: {
          not: "alfred@test.mail"
        }
      }
    });
    
    console.log(`✅ Nettoyage terminé : ${deletedUsers.count} comptes non vérifiés supprimés`);
    
    // Statistiques supplémentaires
    const totalUnverified = await prisma.user.count({
      where: {
        emailVerified: null,
        email: {
          not: "alfred@test.mail"
        }
      }
    });
    
    console.log(`📊 Comptes non vérifiés restants : ${totalUnverified}`);
    
    // Nettoyer aussi les tokens de vérification expirés
    const deletedTokens = await prisma.verificationtoken.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    });
    
    console.log(`🗑️ Tokens expirés supprimés : ${deletedTokens.count}`);
    
    return {
      success: true,
      deletedUsers: deletedUsers.count,
      remainingUnverified: totalUnverified,
      deletedTokens: deletedTokens.count,
      cleanedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error);
    return {
      success: false,
      error: error.message,
      cleanedAt: new Date().toISOString()
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  cleanupUnverifiedUsers()
    .then((result) => {
      if (result.success) {
        console.log('🎉 Script de nettoyage exécuté avec succès');
        process.exit(0);
      } else {
        console.error('💥 Erreur lors de l\'exécution du script');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Erreur fatale :', error);
      process.exit(1);
    });
}

module.exports = { cleanupUnverifiedUsers }; 