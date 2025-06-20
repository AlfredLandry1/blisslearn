const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAccounts() {
  try {
    console.log('🔍 Analyse du système d\'authentification...\n');

    // Vérifier tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
      }
    });

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s):`);
    users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`);
      console.log(`    Nom: ${user.name || 'Non défini'}`);
      console.log(`    Image: ${user.image || 'Non définie'}`);
      console.log(`    Email vérifié: ${user.emailVerified || 'Non vérifié'}`);
    });

    // Vérifier les comptes dans la table account
    console.log('\n🔍 Vérification de la table account...');
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        type: true,
        provider: true,
        providerAccountId: true,
        refresh_token: true,
        access_token: true,
        expires_at: true,
        token_type: true,
        scope: true,
        id_token: true,
        session_state: true,
      }
    });

    console.log(`📊 ${accounts.length} compte(s) trouvé(s) dans la table account:`);
    accounts.forEach(account => {
      console.log(`  - ID: ${account.id}`);
      console.log(`    UserID: ${account.userId}`);
      console.log(`    Provider: ${account.provider}`);
      console.log(`    Type: ${account.type}`);
      console.log(`    ProviderAccountId: ${account.providerAccountId}`);
      console.log(`    Expires at: ${account.expires_at ? new Date(account.expires_at * 1000) : 'Non défini'}`);
      console.log(`    Scope: ${account.scope || 'Non défini'}`);
      console.log('    ---');
    });

    // Vérifier les sessions
    console.log('\n🔍 Vérification de la table session...');
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        sessionToken: true,
        userId: true,
        expires: true,
      }
    });

    console.log(`📊 ${sessions.length} session(s) trouvée(s):`);
    sessions.forEach(session => {
      console.log(`  - ID: ${session.id}`);
      console.log(`    UserID: ${session.userId}`);
      console.log(`    Expires: ${session.expires}`);
      console.log('    ---');
    });

    // Vérifier la correspondance utilisateurs/comptes
    console.log('\n🔍 Correspondance utilisateurs/comptes:');
    for (const user of users) {
      const userAccounts = accounts.filter(acc => acc.userId === user.id);
      console.log(`  - ${user.email}: ${userAccounts.length} compte(s)`);
      userAccounts.forEach(acc => {
        console.log(`    • ${acc.provider} (${acc.type})`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAccounts(); 