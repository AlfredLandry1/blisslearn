# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-19

### 🚀 Ajouté

- **Client API personnalisé** : Nouveau client API basé sur Fetch natif
  - Gestion automatique des timeouts (30s par défaut)
  - Annulation automatique des requêtes lors du démontage
  - Retry automatique en cas d'échec
  - Intercepteurs pour logging et monitoring
  - Cache intelligent avec invalidation

- **Hook useApiClient** : Hook React pour utiliser le client API
  - API similaire à Axios pour faciliter la migration
  - Gestion automatique des états (loading, error, data)
  - Callbacks onSuccess et onError
  - Typage TypeScript strict

- **Composant ApiClientExample** : Exemple d'utilisation du client API
  - Démonstration des fonctionnalités
  - Tests de gestion d'erreurs
  - Exemples de configuration

### 🔄 Modifié

- **Migration complète des composants** vers le nouveau client API :
  
  #### Phase 1 - Composants Critiques
  - `ProgressTracker.tsx` : Migration vers useApiClient
  - `CourseCard.tsx` : Migration vers useApiClient
  - `UserInfoCard.tsx` : Migration vers useApiClient
  - `CourseRecommendations.tsx` : Migration vers useApiClient

  #### Phase 2 - Formulaires d'Authentification
  - `RegisterForm.tsx` : Migration vers useApiClient
  - `ForgotPasswordForm.tsx` : Migration vers useApiClient
  - `ResetPasswordForm.tsx` : Migration vers useApiClient
  - `VerifyEmailForm.tsx` : Migration vers useApiClient

  #### Phase 3 - Pages Principales
  - `Explorer` : Migration vers useApiClient
  - `My Courses` : Migration vers useApiClient
  - `Certifications` : Migration vers useApiClient
  - `Progress` : Migration vers useApiClient

  #### Phase 4 - Composants Secondaires
  - `BlissChatbot.tsx` : Migration vers useApiClient
  - `OnboardingWizard.tsx` : Migration vers useApiClient
  - `PredictionCard.tsx` : Migration vers useApiClient

### 🛠️ Technique

- **Performance** : Suppression de la dépendance Axios, réduction du bundle size
- **Robustesse** : Gestion centralisée des erreurs avec retry automatique
- **Maintenabilité** : Code plus lisible et réduction de la duplication
- **Expérience utilisateur** : États de chargement cohérents et messages d'erreur personnalisés

### 📚 Documentation

- **README.md** : Ajout de la section Client API avec exemples d'utilisation
- **docs/API_CLIENT.md** : Documentation technique complète du client API
- **CHANGELOG.md** : Ce fichier pour documenter les changements

### 🧪 Tests

- **Tests unitaires** : Ajout de tests pour le client API
- **Tests d'intégration** : Tests pour le hook useApiClient
- **Tests de performance** : Validation des améliorations

## [1.0.0] - 2024-12-01

### 🎉 Ajouté

- **Plateforme BlissLearn** : Lancement initial
- **Authentification** : NextAuth.js avec Google OAuth
- **Dashboard utilisateur** : Interface principale avec statistiques
- **Gestion des cours** : Système de cours avec progression
- **Base de données** : Prisma avec PostgreSQL
- **Interface utilisateur** : Design moderne avec Tailwind CSS
- **Gamification** : Système de badges et objectifs
- **IA Prédictive** : Prédictions d'évolution et recommandations
- **Notifications** : Système de notifications en temps réel
- **Onboarding** : Processus d'intégration utilisateur

### 🔐 Sécurité

- **Vérification d'email** : Système de vérification obligatoire
- **Gestion des mots de passe** : Réinitialisation sécurisée
- **Protection des routes** : Middleware de sécurité
- **Nettoyage automatique** : Suppression des comptes non vérifiés

### 🎨 Interface

- **Design System** : Composants UI cohérents
- **Responsive Design** : Optimisé pour tous les appareils
- **Thème sombre** : Interface élégante
- **Animations** : Transitions fluides avec Framer Motion
- **Accessibilité** : Conformité WCAG

### 📊 Fonctionnalités

- **Explorateur de cours** : Recherche et filtres avancés
- **Système de paliers** : Validation de progression
- **Notes et annotations** : Éditeur intégré
- **Favoris** : Organisation personnalisée
- **Statistiques** : Suivi détaillé de la progression
- **Calendrier** : Planification des sessions
- **Chatbot IA** : Assistant conversationnel

### 🛠️ Technique

- **Next.js 15** : Framework React moderne
- **TypeScript** : Typage strict
- **Prisma ORM** : Gestion de base de données
- **Zustand** : Gestion d'état global
- **Tailwind CSS** : Framework CSS utilitaire
- **Radix UI** : Composants accessibles
- **Lucide Icons** : Icônes cohérentes

## [Non publié]

### 🔧 Corrections techniques

#### Correction de l'erreur HTTP 500 et synchronisation du store global
- **Corrigé** : Erreur HTTP 500 sur l'endpoint notifications en ajoutant des logs de débogage
- **Authentifié** : Utilisation d'authenticatedApiClient pour inclure les cookies de session
- **Synchronisé** : Ajout de méthodes `removeCourseWithSync` et `toggleFavoriteWithSync` dans le store des cours
- **Migré** : Page "My Courses" vers l'utilisation du store courseStore au lieu des états locaux
- **Amélioré** : Synchronisation automatique entre les actions utilisateur et l'API
- **Résolu** : Problème de cours qui ne disparaissent pas après suppression

#### Correction de l'erreur HTTP 404 "Not Found"
- **Corrigé** : Erreur 404 sur la page notifications en simplifiant la gestion des données
- **Simplifié** : Gestion des données dans la page notifications en utilisant uniquement le store Zustand
- **Migré** : Service de notifications vers le client API pour une meilleure cohérence
- **Optimisé** : Suppression de la duplication entre notifications normales et persistantes
- **Nettoyé** : Suppression des notifications de test de la base de données
- **Authentifié** : Utilisation d'authenticatedApiClient pour inclure les cookies de session

### 🧹 Nettoyage et simplification

#### Suppression des éléments de test
- **Supprimé** : Composants de test `TestNotificationButton`, `TestEmailButton`, `TestAbortController`
- **Supprimé** : Utilisation des composants de test dans les pages dashboard et notifications
- **Simplifié** : Interface utilisateur en retirant les boutons de test

#### Suppression des boutons de switch vue grille/table
- **Supprimé** : Boutons de switch entre vue grille et vue table dans `app/dashboard/explorer/page.tsx`
- **Supprimé** : Boutons de switch entre vue grille et vue table dans `app/dashboard/my-courses/page.tsx`
- **Simplifié** : Interface utilisateur en gardant uniquement la vue grille par défaut
- **Retiré** : Imports inutiles (`Grid3X3`, `List`) des pages concernées

#### Améliorations de l'interface
- **Simplifié** : En-têtes des pages avec bouton d'actualisation uniquement
- **Uniformisé** : Interface cohérente entre les pages explorer et my-courses
- **Optimisé** : Code plus propre et maintenable

### 🔧 Corrections techniques

#### Correction de l'erreur "body stream already read"
- **Corrigé** : Lecture multiple du body de la réponse dans `lib/api-client.ts`
- **Corrigé** : Lecture multiple du body dans `app/verify/[id]/page.tsx`
- **Corrigé** : Lecture multiple du body dans `components/courses/CourseCard.tsx`
- **Amélioré** : Gestion unifiée du parsing des réponses JSON/text
- **Optimisé** : Prévention des erreurs de lecture de stream

#### Correction de l'erreur HTTP 405 "Method Not Allowed"
- **Corrigé** : Utilisation de `PATCH` au lieu de `PUT` pour marquer les notifications comme lues
- **Vérifié** : Endpoints des notifications supportent les bonnes méthodes HTTP
- **Amélioré** : Cohérence entre les méthodes HTTP utilisées et les endpoints API
- **Optimisé** : Gestion correcte des requêtes de mise à jour des notifications

#### Correction des boucles infinies React
- **Corrigé** : Dépendances instables dans `useEffect` du hook `useApiClient`
- **Amélioré** : Gestion des callbacks avec `useRef` pour éviter les re-renders
- **Optimisé** : Gestion des erreurs d'annulation de requêtes (AbortError)

#### Migration vers le client API
- **Migré** : Pages dashboard, explorer, my-courses vers le client API
- **Amélioré** : Gestion des erreurs et des états de chargement
- **Standardisé** : Interface cohérente pour les appels API

## Format des versions

- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

## Liens

- [Documentation API Client](docs/API_CLIENT.md)
- [Guide de migration](docs/MIGRATION_PLAN.md)
- [Système de notifications](docs/NOTIFICATIONS_SYSTEM.md) 