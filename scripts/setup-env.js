const fs = require('fs');
const crypto = require('crypto');

// Générer un secret sécurisé pour NextAuth
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const envContent = `# Base de données
DATABASE_URL="mysql://root:@localhost:3306/blisslearn-db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateSecret()}"

# Google OAuth (Required for authentication)
# ⚠️  IMPORTANT: Remplacez ces valeurs par vos vraies clés Google OAuth
# Obtenez-les sur: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-real-google-client-id-here
GOOGLE_CLIENT_SECRET=your-real-google-client-secret-here

# Variables d'environnement pour le développement
NODE_ENV="development"
`;

// Écrire le fichier .env.local
fs.writeFileSync('.env.local', envContent);

console.log('✅ Fichier .env.local créé avec succès !');
console.log('📝 Variables d\'environnement configurées :');
console.log('   - DATABASE_URL: mysql://root:@localhost:3306/blisslearn-db');
console.log('   - NEXTAUTH_URL: http://localhost:3000');
console.log('   - NEXTAUTH_SECRET: [généré automatiquement]');
console.log('   - GOOGLE_CLIENT_ID: [à configurer]');
console.log('   - GOOGLE_CLIENT_SECRET: [à configurer]');
console.log('   - NODE_ENV: development');
console.log('');
console.log('⚠️  ÉTAPES OBLIGATOIRES pour Google OAuth :');
console.log('1. Allez sur https://console.cloud.google.com/');
console.log('2. Créez un projet ou sélectionnez un existant');
console.log('3. Activez l\'API Google+ API');
console.log('4. Créez des identifiants OAuth 2.0 (Web application)');
console.log('5. Configurez les URLs autorisées :');
console.log('   - JavaScript origins: http://localhost:3000');
console.log('   - Redirect URIs: http://localhost:3000/api/auth/callback/google');
console.log('6. Remplacez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env.local');
console.log('7. Redémarrez votre serveur Next.js');
console.log('');
console.log('⚠️  IMPORTANT: En production, changez NEXTAUTH_SECRET pour un secret sécurisé'); 