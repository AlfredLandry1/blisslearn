# Onboarding Multi-Étapes - BlissLearn

Un système d'onboarding progressif et interactif pour collecter les préférences d'apprentissage des utilisateurs et générer des recommandations personnalisées.

## 🎯 **Objectif**

Offrir aux nouveaux apprenants de BlissLearn une expérience d'onboarding progressive qui collecte les informations clés pour alimenter le moteur de recommandation de cours.

## 📋 **Étapes de l'onboarding**

### **Étape 1 : Objectifs d'apprentissage**
- Multi-sélection d'objectifs prédéfinis
- Possibilité d'ajouter un objectif personnalisé
- Validation : au moins un objectif requis

### **Étape 2 : Domaines d'intérêt**
- Multi-sélection de domaines (IA, Marketing, Dev, etc.)
- Interface avec cases à cocher
- Validation : au moins un domaine requis

### **Étape 3 : Niveau de compétence**
- Choix unique : Débutant / Intermédiaire / Avancé
- Boutons radio avec descriptions
- Validation : niveau requis

### **Étape 4 : Disponibilité horaire**
- Slider interactif (0-40h/semaine)
- Champ de saisie numérique
- Suggestions selon la disponibilité

### **Étape 5 : Plateformes préférées** *(facultatif)*
- Multi-sélection de plateformes
- Étape optionnelle avec possibilité de passer
- Explication du pourquoi de cette question

### **Étape 6 : Préférences de cours**
- Format de cours (multi-choix)
- Durée idéale (radio)
- Langue préférée (select)
- Validation : tous les champs requis

### **Étape 7 : Récapitulatif**
- Affichage de toutes les réponses
- Possibilité de modifier chaque section
- Bouton final pour générer les recommandations

## 🚀 **Utilisation**

```tsx
import { OnboardingWizard } from "@/components/onboarding";

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
```

## 🎨 **Fonctionnalités UX**

### **Progression visuelle**
- Barre de progression en haut
- Indicateur "Étape X sur Y"
- Pourcentage de progression

### **Navigation**
- Boutons "Précédent" et "Suivant" toujours visibles
- Validation avant passage à l'étape suivante
- Possibilité de revenir en arrière

### **Validation**
- Validation en temps réel
- Messages d'erreur clairs
- Boutons désactivés si validation échoue

### **Animations**
- Transitions fluides entre les étapes
- Animations d'apparition des éléments
- Feedback visuel immédiat

## 📊 **Données collectées**

```typescript
interface OnboardingData {
  learningObjectives: string[];        // Objectifs d'apprentissage
  domainsOfInterest: string[];         // Domaines d'intérêt
  skillLevel: string;                  // Niveau de compétence
  weeklyHours: number;                 // Heures par semaine
  preferredPlatforms: string[];        // Plateformes préférées
  coursePreferences: {
    format: string[];                  // Formats de cours
    duration: string;                  // Durée idéale
    language: string;                  // Langue préférée
  };
}
```

## 🎯 **Bonnes pratiques implémentées**

- ✅ **Progression claire** : indicateur visuel de l'avancement
- ✅ **Un champ par ligne** : interface simple et claire
- ✅ **Labels explicites** : toujours visibles, pas de placeholders
- ✅ **Validation douce** : feedback à la sortie du champ
- ✅ **Messages d'erreur clairs** : explicites et constructifs
- ✅ **Navigation fluide** : boutons toujours visibles
- ✅ **Champs obligatoires marqués** : avec astérisque
- ✅ **Étapes facultatives signalées** : explicitement mentionnées
- ✅ **Récapitulatif final** : vérification avant soumission

## 🔧 **Personnalisation**

### **Modifier les options**
Les options sont définies dans `types.ts` :
- `LEARNING_OBJECTIVES`
- `DOMAINS_OF_INTEREST`
- `SKILL_LEVELS`
- `PREFERRED_PLATFORMS`
- `COURSE_FORMATS`
- `COURSE_DURATIONS`
- `LANGUAGES`

### **Modifier le design**
- Utilise les classes Tailwind CSS
- Respecte le thème sombre futuriste
- Couleurs cohérentes avec BlissLearn

### **Ajouter des étapes**
1. Créer le composant dans `steps/`
2. Ajouter l'import dans `OnboardingWizard.tsx`
3. Mettre à jour `TOTAL_STEPS`
4. Ajouter le case dans `renderStep()`

## 📱 **Responsive**

L'onboarding est entièrement responsive :
- Mobile-first design
- Grilles adaptatives
- Boutons et champs optimisés pour mobile
- Navigation tactile

## 🎉 **Résultat**

Un onboarding moderne, intuitif et efficace qui guide l'utilisateur étape par étape pour collecter toutes les informations nécessaires à la génération de recommandations personnalisées de cours. 