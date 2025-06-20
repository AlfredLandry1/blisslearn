export interface OnboardingData {
  learningObjectives: string[];
  domainsOfInterest: string[];
  skillLevel: string;
  weeklyHours: number;
  preferredPlatforms: string[];
  coursePreferences: {
    format: string[];
    duration: string;
    language: string;
  };
}

export interface StepProps {
  data: OnboardingData;
  updateData: (stepData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: any
}

export interface Step7Props extends StepProps {
  onSubmit: () => void;
  isLoading: boolean;
}

// Options pour les différentes étapes
export const LEARNING_OBJECTIVES = [
  "Devenir développeur web",
  "Maîtriser la cybersécurité",
  "Apprendre l'intelligence artificielle",
  "Développer des compétences en marketing digital",
  "Créer des applications mobiles",
  "Maîtriser la data science",
  "Apprendre le design UI/UX",
  "Développer des compétences en gestion de projet",
  "Autre"
];

export const DOMAINS_OF_INTEREST = [
  "Intelligence artificielle",
  "Marketing digital",
  "UI/UX Design",
  "Développement web",
  "Développement mobile",
  "Cybersécurité",
  "Data science",
  "Cloud computing",
  "DevOps",
  "Blockchain",
  "Machine Learning",
  "Autre"
];

export const SKILL_LEVELS = [
  { value: "beginner", label: "Débutant", description: "Je découvre ce domaine" },
  { value: "intermediate", label: "Intermédiaire", description: "J'ai quelques bases" },
  { value: "advanced", label: "Avancé", description: "Je maîtrise déjà ce domaine" }
];

export const PREFERRED_PLATFORMS = [
  "Udemy",
  "Coursera",
  "edX",
  "LinkedIn Learning",
  "Pluralsight",
  "Skillshare",
  "Autre"
];

export const COURSE_FORMATS = [
  "Vidéo",
  "Texte/Slides",
  "Interactif (quiz)",
  "Projets pratiques",
  "Autre"
];

export const COURSE_DURATIONS = [
  { value: "short", label: "< 2h", description: "Cours rapide" },
  { value: "medium", label: "2-5h", description: "Cours moyen" },
  { value: "long", label: "5-10h", description: "Cours long" },
  { value: "extended", label: "> 10h", description: "Formation complète" }
];

export const LANGUAGES = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Italien",
  "Autre"
]; 