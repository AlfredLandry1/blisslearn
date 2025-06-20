# Guide de Configuration Google OAuth pour BlissLearn

## 🚨 Problème actuel
L'erreur "Configuration" indique que vos clés Google OAuth sont des valeurs de test, pas vos vraies clés.

## 📋 Étapes de configuration

### 1. Créer un projet Google Cloud Console

1. **Accédez à Google Cloud Console**
   - Allez sur [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Connectez-vous avec votre compte Google

2. **Créer un nouveau projet**
   - Cliquez sur le sélecteur de projet en haut
   - Cliquez sur "Nouveau projet"
   - Nommez-le "BlissLearn" ou "BlissLearn-Auth"
   - Cliquez sur "Créer"

### 2. Activer l'API Google+ API

1. **Accédez aux APIs**
   - Dans le menu de gauche, allez à "APIs & Services" > "Library"
   - Recherchez "Google+ API"
   - Cliquez dessus et activez-la

### 3. Configurer l'écran de consentement OAuth

1. **Créer l'écran de consentement**
   - Allez à "APIs & Services" > "OAuth consent screen"
   - Sélectionnez "External" (pour le développement)
   - Remplissez les informations :
     - **App name**: BlissLearn
     - **User support email**: votre email
     - **Developer contact information**: votre email
   - Cliquez sur "Save and Continue"

2. **Ajouter des scopes**
   - Cliquez sur "Add or Remove Scopes"
   - Ajoutez : `email`, `profile`, `openid`
   - Cliquez sur "Save and Continue"

3. **Ajouter des utilisateurs de test**
   - Ajoutez votre email Google
   - Cliquez sur "Save and Continue"

### 4. Créer les identifiants OAuth

1. **Créer un ID client OAuth 2.0**
   - Allez à "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
   - Sélectionnez "Web application"

2. **Configurer les URLs autorisées**
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Cliquez sur "Create"

3. **Récupérer vos clés**
   - Notez le **Client ID** et le **Client Secret**
   - ⚠️ Gardez le Client Secret secret !

### 5. Mettre à jour votre fichier .env.local

Remplacez les valeurs dans votre fichier `.env.local` :

```env
# Google OAuth (Remplacez par vos vraies clés)
GOOGLE_CLIENT_ID=votre-vrai-client-id-ici
GOOGLE_CLIENT_SECRET=votre-vrai-client-secret-ici
```

### 6. Redémarrer le serveur

```bash
npm run dev
```

## 🔧 Test de la configuration

Après avoir configuré vos vraies clés, testez avec :

```bash
node test-auth-config.js
```

Vous devriez voir :
```
✅ GOOGLE_CLIENT_ID format valide
✅ GOOGLE_CLIENT_SECRET format valide
```

## 🚀 Test de connexion

1. Allez sur `http://localhost:3000/auth/login`
2. Cliquez sur "Continuer avec Google"
3. Vous devriez être redirigé vers Google pour l'authentification
4. Après connexion, vous devriez être redirigé vers `/dashboard`

## ❌ Problèmes courants

### Erreur "redirect_uri_mismatch"
- Vérifiez que l'URL de redirection dans Google Console correspond exactement à `http://localhost:3000/api/auth/callback/google`

### Erreur "invalid_client"
- Vérifiez que vos Client ID et Client Secret sont corrects
- Assurez-vous qu'il n'y a pas d'espaces en trop

### Erreur "access_denied"
- Vérifiez que votre email est dans la liste des utilisateurs de test
- Assurez-vous que l'API Google+ est activée

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur Next.js
2. Testez avec `node test-auth-config.js`
3. Vérifiez la configuration dans Google Cloud Console 