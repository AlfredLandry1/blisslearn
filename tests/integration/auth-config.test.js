const { config } = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🔍 Test de configuration NextAuth');
console.log('================================');

// Vérifier les variables essentielles
console.log('1. Variables d\'environnement:');
console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ Non défini');
console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Défini' : '❌ Non défini');
console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || '❌ Non défini');
console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ Non défini');
console.log('   DATABASE_URL:', process.env.DATABASE_URL || '❌ Non défini');

// Vérifier le format des clés Google
console.log('\n2. Validation des clés Google:');
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (clientId) {
  if (clientId.includes('your-google-client-id') || clientId.includes('123803664367')) {
    console.log('   ❌ GOOGLE_CLIENT_ID semble être une valeur de test');
  } else if (clientId.endsWith('.apps.googleusercontent.com')) {
    console.log('   ✅ GOOGLE_CLIENT_ID format valide');
  } else {
    console.log('   ⚠️ GOOGLE_CLIENT_ID format suspect');
  }
}

if (clientSecret) {
  if (clientSecret.includes('your-google-client-secret') || clientSecret.includes('GOCSPX-')) {
    console.log('   ❌ GOOGLE_CLIENT_SECRET semble être une valeur de test');
  } else if (clientSecret.startsWith('GOCSPX-')) {
    console.log('   ✅ GOOGLE_CLIENT_SECRET format valide');
  } else {
    console.log('   ⚠️ GOOGLE_CLIENT_SECRET format suspect');
  }
}

// Test de connexion à la base de données
console.log('\n3. Test de connexion à la base de données:');
const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('   ✅ Connexion à la base de données réussie');
    
    // Test de requête simple
    const userCount = await prisma.user.count();
    console.log('   ✅ Requête de test réussie (utilisateurs:', userCount, ')');
  } catch (error) {
    console.log('   ❌ Erreur de connexion à la base de données:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase().then(() => {
  console.log('\n📋 Résumé:');
  console.log('================================');
  
  const issues = [];
  
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes('your-google-client-id')) {
    issues.push('- Clés Google OAuth manquantes ou invalides');
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    issues.push('- NEXTAUTH_SECRET manquant');
  }
  
  if (!process.env.DATABASE_URL) {
    issues.push('- DATABASE_URL manquant');
  }
  
  if (issues.length === 0) {
    console.log('✅ Configuration semble correcte');
  } else {
    console.log('❌ Problèmes détectés:');
    issues.forEach(issue => console.log(issue));
  }
  
  console.log('\n💡 Solutions:');
  console.log('1. Configurez vos vraies clés Google OAuth dans .env.local');
  console.log('2. Vérifiez que votre base de données MySQL est active');
  console.log('3. Redémarrez le serveur après modification des variables');
}); 