const fs = require('fs');
const path = require('path');

// Lire le fichier .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('🔍 Lecture du fichier:', envPath);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Fichier .env.local trouvé');
  
  // Parser les variables
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });
  
  console.log('🔍 Variables trouvées:');
  console.log('NEXTAUTH_SECRET:', envVars.NEXTAUTH_SECRET ? '✅ Défini' : '❌ Non défini');
  console.log('NEXTAUTH_URL:', envVars.NEXTAUTH_URL ? '✅ Défini' : '❌ Non défini');
  console.log('GOOGLE_CLIENT_ID:', envVars.GOOGLE_CLIENT_ID ? '✅ Défini' : '❌ Non défini');
  console.log('GOOGLE_CLIENT_SECRET:', envVars.GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ Non défini');
  console.log('DATABASE_URL:', envVars.DATABASE_URL ? '✅ Défini' : '❌ Non défini');
  
  if (!envVars.GOOGLE_CLIENT_ID || !envVars.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Variables Google manquantes dans .env.local!');
    process.exit(1);
  } else {
    console.log('✅ Toutes les variables sont présentes dans .env.local');
  }
} else {
  console.error('❌ Fichier .env.local non trouvé!');
  process.exit(1);
} 