# BlissLearn

BlissLearn est une plateforme d'agrégation et de recommandation de parcours d'apprentissage, qui centralise des cours issus de plateformes externes (Udemy, Skillshare, Coursera, etc.) pour offrir une expérience personnalisée, motivante et moderne.

## 🚀 Concept
- **Aucune création de cours propriétaire** : BlissLearn référence et organise des cours existants sur le web.
- **Parcours personnalisés** : onboarding intelligent, recommandations selon le profil, l'objectif et le niveau.
- **Suivi de progression** : l'utilisateur peut marquer ses cours comme commencés, en cours, terminés, ajouter des notes, favoris, etc.
- **Notifications, IA, dashboard** : expérience utilisateur moderne, chatbot IA, notifications, historique, etc.

## ✨ Fonctionnalités principales
- Recherche et filtres avancés sur tous les cours référencés
- Système de notifications globales (Zustand + Sonner)
- Chatbot IA (Gemini) avec historique persistant
- Onboarding multi-étapes pour personnaliser l'expérience
- Dashboard utilisateur, suivi de progression local
- UI responsive, moderne, inspirée des meilleurs design systems
- Intégration OAuth (Google, etc.)

## 🚧 Fonctionnalités futures
- **Parcours d'apprentissage structurés** : Séquences de cours organisées logiquement
- **Certifications et badges** : Système de validation et reconnaissance
- **Recommandations IA avancées** : Suggestions personnalisées basées sur l'apprentissage
- **Parcours thématiques** : Frontend, Backend, Data Science, etc.
- **Progression guidée** : Parcours recommandés pour débutants et experts

## 🛠️ Installation
1. **Cloner le repo**
   ```sh
   git clone https://github.com/AlfredLandry1/blisslearn.git
   cd blisslearn
   ```
2. **Installer les dépendances**
   ```sh
   npm install
   # ou pnpm install
   ```
3. **Configurer l'environnement**
   - Copier `.env.example` en `.env` et remplir les variables (MySQL, Google OAuth, etc.)
4. **Lancer la base et les migrations**
   ```sh
   npx prisma migrate dev
   ```
5. **Démarrer le projet**
   ```sh
npm run dev
   ```

## 🤝 Contribution
- Fork, crée une branche, propose une PR !
- Respecte le style de code (ESLint, Prettier, conventions du projet)
- Toute suggestion UX/UI ou nouvelle source de cours est bienvenue.

## 📄 Licence
MIT — voir [LICENSE](./LICENSE)

## 🌐 Liens utiles
- [BlissLearn sur GitHub](https://github.com/AlfredLandry1/blisslearn)
- [Documentation technique](./docs/)

---

> BlissLearn n'est pas affilié aux plateformes de cours référencées. Le suivi de progression est local à BlissLearn.
