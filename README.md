# BlissLearn 🚀

BlissLearn est une plateforme d'agrégation et de recommandation de parcours d'apprentissage moderne, qui centralise des cours issus de plateformes externes (Udemy, Skillshare, Coursera, etc.) pour offrir une expérience personnalisée, motivante et gamifiée.

## 🎯 Concept
- **Aucune création de cours propriétaire** : BlissLearn référence et organise des cours existants sur le web
- **Parcours personnalisés** : Onboarding intelligent, recommandations selon le profil, l'objectif et le niveau
- **Suivi de progression avancé** : Système de paliers, notes, favoris, et progression détaillée
- **IA Prédictive** : Prédictions d'évolution et recommandations personnalisées
- **Gamification** : Badges, streaks, objectifs et récompenses

## ✨ Fonctionnalités principales

### 🔐 Authentification & Sécurité
- **Authentification complète** : NextAuth.js avec Google OAuth
- **Vérification d'email** : Système de vérification obligatoire avec tokens sécurisés
- **Gestion des mots de passe** : Réinitialisation, configuration pour utilisateurs Google
- **Protection des routes** : Middleware de sécurité et redirections intelligentes
- **Nettoyage automatique** : Suppression des comptes non vérifiés après 7 jours

### 🎨 Interface utilisateur moderne
- **Design System complet** : Composants UI cohérents avec Tailwind CSS
- **Responsive design** : Optimisé pour mobile, tablette et desktop
- **Thème sombre** : Interface élégante avec SpaceBackground et animations
- **Animations fluides** : Framer Motion pour les transitions
- **Accessibilité** : Conformité WCAG avec couleurs contrastées

### 📊 Dashboard & Analytics
- **Dashboard personnalisé** : Vue d'ensemble avec statistiques en temps réel
- **Graphiques interactifs** : Visualisations avec Recharts et couleurs accessibles
- **Prédictions IA** : Graphiques prédictifs avec couleurs vives et contrastées
- **Statistiques détaillées** : Progression, temps passé, objectifs
- **Calendrier d'apprentissage** : Planification et suivi des sessions

### 🧠 Intelligence Artificielle
- **Chatbot IA** : Assistant conversationnel avec Gemini
- **Prédictions d'évolution** : Analyse des patterns d'apprentissage
- **Recommandations personnalisées** : Suggestions basées sur le profil utilisateur
- **Résumés automatiques** : Génération de contenu avec IA

### 📚 Gestion des cours
- **Explorateur de cours** : Recherche avancée avec filtres multiples
- **Système de paliers** : Validation de progression avec rapports détaillés
- **Notes et annotations** : Éditeur de notes intégré
- **Favoris et listes** : Organisation personnalisée des cours
- **Progression détaillée** : Suivi par chapitre et section

### 🔔 Notifications & Communication
- **Système de notifications** : Notifications persistantes et temporaires
- **Notifications par email** : Vérification, réinitialisation de mot de passe
- **Notifications push** : Rappels et mises à jour en temps réel
- **Gestion des préférences** : Personnalisation des notifications

### 🎮 Gamification
- **Système de badges** : Récompenses pour les accomplissements
- **Streaks d'apprentissage** : Suivi des jours consécutifs
- **Objectifs personnalisés** : Défis et challenges adaptés
- **Classements** : Comparaison avec d'autres apprenants
- **Récompenses** : Système de points et achievements

### 📱 Onboarding & Personnalisation
- **Onboarding multi-étapes** : Configuration progressive du profil
- **Préférences utilisateur** : Personnalisation de l'expérience
- **Profil détaillé** : Informations complètes et objectifs
- **Recommandations initiales** : Suggestions basées sur l'onboarding

### 🛠️ Fonctionnalités techniques
- **Base de données robuste** : Prisma avec PostgreSQL/MySQL
- **API RESTful** : Endpoints sécurisés et optimisés
- **Gestion d'état** : Zustand pour l'état global
- **Validation** : Formik et Yup pour les formulaires
- **Performance** : Optimisations Next.js et lazy loading

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL ou MySQL
- Compte Google Cloud (pour OAuth)

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/AlfredLandry1/blisslearn.git
   cd blisslearn
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Remplir les variables dans `.env.local` :
   ```env
   # Base de données
   DATABASE_URL="postgresql://user:password@localhost:5432/blisslearn"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email (pour les notifications)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@blisslearn.com"
   
   # IA (Gemini)
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Configuration de la base de données**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

6. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🧪 Scripts utiles

```bash
# Développement
npm run dev          # Lancer en mode développement
npm run build        # Build de production
npm run start        # Lancer en mode production

# Base de données
npm run db:push      # Pousser les changements de schéma
npm run db:seed      # Peupler la base avec des données de test
npm run db:studio    # Ouvrir Prisma Studio

# Nettoyage
npm run cleanup:notifications    # Nettoyer les notifications anciennes
npm run cleanup:users           # Nettoyer les utilisateurs non vérifiés

# Qualité de code
npm run lint         # Vérifier le code avec ESLint
npm run format       # Formater le code avec Prettier
npm run type-check   # Vérifier les types TypeScript
```

## 🏗️ Architecture

### Structure du projet
```
blisslearn/
├── app/                    # Pages Next.js 13+ (App Router)
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Pages du dashboard
│   └── onboarding/        # Pages d'onboarding
├── components/            # Composants React réutilisables
│   ├── auth/             # Composants d'authentification
│   ├── dashboard/        # Composants du dashboard
│   ├── ui/               # Composants UI de base
│   └── onboarding/       # Composants d'onboarding
├── lib/                  # Utilitaires et configurations
├── prisma/               # Schéma et migrations de base de données
├── stores/               # Gestion d'état Zustand
├── hooks/                # Hooks React personnalisés
└── types/                # Types TypeScript
```

### Technologies utilisées
- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS, Framer Motion
- **Base de données** : Prisma, PostgreSQL/MySQL
- **Authentification** : NextAuth.js
- **IA** : Google Gemini API
- **Gestion d'état** : Zustand
- **Formulaires** : Formik, Yup
- **Graphiques** : Recharts
- **Notifications** : Sonner
- **Client API** : Client API personnalisé basé sur Fetch natif

## 🔌 Client API

### Vue d'ensemble

BlissLearn utilise un **client API personnalisé** basé sur Fetch natif, offrant une alternative robuste à Axios avec les avantages suivants :

- ✅ **Performance** : Pas de dépendance externe
- ✅ **Compatibilité** : Optimisé pour Next.js 15
- ✅ **Robustesse** : Gestion d'erreurs avancée
- ✅ **Flexibilité** : API similaire à Axios

### Utilisation

```typescript
import { useApiClient } from "@/hooks/useApiClient";

function MonComposant() {
  const {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: del
  } = useApiClient<MonType>({
    onSuccess: (data) => console.log('Succès:', data),
    onError: (error) => console.error('Erreur:', error)
  });

  useEffect(() => {
    get('/api/mon-endpoint');
  }, [get]);

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error.message}</p>}
      {data && <p>Données: {JSON.stringify(data)}</p>}
    </div>
  );
}
```

### Fonctionnalités

#### 🔄 Gestion automatique des requêtes
- **Timeout** : 30 secondes par défaut
- **Annulation** : Automatique lors du démontage du composant
- **Retry** : Tentatives automatiques en cas d'échec

#### 🛡️ Gestion d'erreurs robuste
```typescript
const { get } = useApiClient({
  onError: (error) => {
    if (error.status === 401) {
      // Redirection vers login
    } else if (error.status === 500) {
      // Notification d'erreur serveur
    }
  }
});
```

#### 📊 Intercepteurs
```typescript
// Logging automatique
apiClient.interceptors.request.use((config) => {
  console.log('Requête:', config.url);
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log('Réponse:', response.status);
  return response;
});
```

### Migration Complète

Tous les composants utilisant `fetch` natif ont été migrés vers le nouveau client API :

- ✅ **Composants critiques** : ProgressTracker, CourseCard, UserInfoCard
- ✅ **Formulaires d'authentification** : RegisterForm, LoginForm, etc.
- ✅ **Pages principales** : Explorer, My Courses, Certifications
- ✅ **Composants secondaires** : BlissChatbot, OnboardingWizard

**Bénéfices obtenus :**
- 🚀 Performance améliorée
- 🛡️ Gestion d'erreurs centralisée
- 🔧 Code plus maintenable
- 📱 Meilleure expérience utilisateur

## 🔧 Configuration avancée

### Variables d'environnement
Consultez le fichier `.env.example` pour la liste complète des variables d'environnement nécessaires.

### Base de données
L'application utilise Prisma comme ORM. Le schéma est défini dans `prisma/schema.prisma`.

### Déploiement
L'application est optimisée pour le déploiement sur Vercel, mais peut être déployée sur n'importe quelle plateforme supportant Next.js.

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines
- Respectez le style de code existant (ESLint, Prettier)
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les changements importants
- Suivez les conventions de commit

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🌐 Liens utiles

- [Documentation technique](./docs/)
- [Guide de déploiement](./docs/deployment.md)
- [Guide de contribution](./docs/contributing.md)
- [Changelog](./CHANGELOG.md)

## 🆘 Support

Si vous rencontrez des problèmes ou avez des questions :

1. Consultez la [documentation](./docs/)
2. Recherchez dans les [issues existantes](https://github.com/AlfredLandry1/blisslearn/issues)
3. Créez une nouvelle issue avec les détails du problème

---

> **Note** : BlissLearn n'est pas affilié aux plateformes de cours référencées. Le suivi de progression est local à BlissLearn et respecte la vie privée des utilisateurs.

**Fait avec ❤️ par l'équipe BlissLearn**
