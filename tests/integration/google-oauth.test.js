const { config } = require('dotenv');
const path = require('path');
const https = require('https');

// Charger les variables d'environnement
config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🔍 Test de validation Google OAuth');
console.log('==================================');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret ? 'Défini' : 'Non défini');

// Test de validation du Client ID
function validateClientId(clientId) {
  if (!clientId) return false;
  
  // Format Google OAuth Client ID
  const googleClientIdPattern = /^\d+-\w+\.apps\.googleusercontent\.com$/;
  return googleClientIdPattern.test(clientId);
}

// Test de validation du Client Secret
function validateClientSecret(clientSecret) {
  if (!clientSecret) return false;
  
  // Format Google OAuth Client Secret (commence par GOCSPX-)
  const googleClientSecretPattern = /^GOCSPX-[A-Za-z0-9_-]+$/;
  return googleClientSecretPattern.test(clientSecret);
}

console.log('\n📋 Validation des formats:');
console.log('Client ID valide:', validateClientId(clientId) ? '✅' : '❌');
console.log('Client Secret valide:', validateClientSecret(clientSecret) ? '✅' : '❌');

// Test de connexion à l'API Google OAuth
function testGoogleOAuthEndpoint() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'accounts.google.com',
      port: 443,
      path: '/.well-known/openid_configuration',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const config = JSON.parse(data);
          console.log('✅ Connexion à Google OAuth API réussie');
          console.log('   Issuer:', config.issuer);
          console.log('   Authorization endpoint:', config.authorization_endpoint);
          resolve(true);
        } catch (error) {
          console.log('❌ Erreur lors du parsing de la réponse Google');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erreur de connexion à Google OAuth API:', error.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Timeout lors de la connexion à Google OAuth API');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test de configuration NextAuth
async function testNextAuthConfig() {
  console.log('\n🔧 Test de configuration NextAuth:');
  
  try {
    // Simuler la configuration NextAuth
    const NextAuth = require('next-auth');
    const GoogleProvider = require('next-auth/providers/google');
    
    console.log('✅ NextAuth et GoogleProvider chargés avec succès');
    
    // Vérifier que les variables sont disponibles
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log('❌ Variables Google OAuth manquantes');
      return false;
    }
    
    console.log('✅ Variables Google OAuth disponibles');
    
    // Test de création du provider (sans initialiser NextAuth)
    try {
      const provider = GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      });
      
      console.log('✅ GoogleProvider créé avec succès');
      console.log('   Provider ID:', provider.id);
      console.log('   Provider name:', provider.name);
      
      return true;
    } catch (error) {
      console.log('❌ Erreur lors de la création du GoogleProvider:', error.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erreur lors du chargement de NextAuth:', error.message);
    return false;
  }
}

// Test principal
async function runTests() {
  console.log('\n🚀 Tests en cours...\n');
  
  // Test 1: Validation des formats
  const formatValid = validateClientId(clientId) && validateClientSecret(clientSecret);
  
  // Test 2: Connexion à Google OAuth API
  const apiValid = await testGoogleOAuthEndpoint();
  
  // Test 3: Configuration NextAuth
  const nextAuthValid = await testNextAuthConfig();
  
  console.log('\n📊 Résumé des tests:');
  console.log('==================================');
  console.log('Format des clés:', formatValid ? '✅' : '❌');
  console.log('API Google accessible:', apiValid ? '✅' : '❌');
  console.log('Configuration NextAuth:', nextAuthValid ? '✅' : '❌');
  
  if (formatValid && apiValid && nextAuthValid) {
    console.log('\n✅ Tous les tests sont passés !');
    console.log('Le problème pourrait venir de :');
    console.log('1. URLs autorisées dans Google Console');
    console.log('2. Configuration de l\'écran de consentement');
    console.log('3. Problème de cache du navigateur');
  } else {
    console.log('\n❌ Problèmes détectés :');
    if (!formatValid) console.log('- Format des clés invalide');
    if (!apiValid) console.log('- Impossible de contacter Google OAuth API');
    if (!nextAuthValid) console.log('- Problème de configuration NextAuth');
  }
  
  console.log('\n💡 Vérifications supplémentaires :');
  console.log('1. Vérifiez dans Google Console que http://localhost:3000 est dans les URLs autorisées');
  console.log('2. Vérifiez que http://localhost:3000/api/auth/callback/google est dans les URLs de redirection');
  console.log('3. Vérifiez que votre email est dans la liste des utilisateurs de test');
  console.log('4. Essayez de vider le cache du navigateur');
}

runTests().catch(console.error); 