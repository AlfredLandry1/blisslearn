const { config } = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🔍 Test du chargement des variables d\'environnement:');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Défini' : '❌ Non défini');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Défini' : '❌ Non défini');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Défini' : '❌ Non défini');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ Non défini');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Défini' : '❌ Non défini');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Variables Google manquantes!');
  process.exit(1);
} else {
  console.log('✅ Toutes les variables sont chargées correctement');
}