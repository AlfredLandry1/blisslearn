import * as Yup from "yup";

// Schéma de validation pour la connexion
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Adresse email invalide")
    .required("L'adresse email est requise"),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis"),
  rememberMe: Yup.boolean()
});

// Schéma de validation pour l'inscription
export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .required("Le prénom est requis"),
  lastName: Yup.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .required("Le nom est requis"),
  email: Yup.string()
    .email("Adresse email invalide")
    .required("L'adresse email est requise"),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .matches(/\d/, "Le mot de passe doit contenir au moins un chiffre")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial")
    .required("Le mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre")
    .required("La confirmation du mot de passe est requise"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "Vous devez accepter les conditions d'utilisation")
    .required("Vous devez accepter les conditions d'utilisation")
});

// Schéma de validation pour le mot de passe oublié
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Adresse email invalide")
    .required("L'adresse email est requise")
});

// Schéma de validation pour la réinitialisation de mot de passe
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .required("Le mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Les mots de passe doivent être identiques")
    .required("La confirmation du mot de passe est requise"),
});

// Schéma de validation pour la configuration de mot de passe (Google users)
export const setPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .required("Le mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Les mots de passe doivent être identiques")
    .required("La confirmation du mot de passe est requise"),
});

// Schéma de validation pour les paliers de progression
export const milestoneValidationSchema = Yup.object().shape({
  learningSummary: Yup.string()
    .min(50, "Le résumé doit contenir au moins 50 caractères")
    .max(1000, "Le résumé ne peut pas dépasser 1000 caractères")
    .required("Le résumé est requis"),
  keyConcepts: Yup.array()
    .of(Yup.string().min(3, "Chaque concept doit contenir au moins 3 caractères"))
    .min(2, "Ajoutez au moins 2 concepts clés")
    .max(10, "Maximum 10 concepts clés")
    .required("Les concepts clés sont requis"),
  challenges: Yup.string()
    .min(20, "Décrivez vos difficultés en au moins 20 caractères")
    .max(500, "Maximum 500 caractères")
    .required("Les difficultés sont requises"),
  nextSteps: Yup.string()
    .min(20, "Décrivez vos prochaines étapes en au moins 20 caractères")
    .max(500, "Maximum 500 caractères")
    .required("Les prochaines étapes sont requises"),
  timeSpentAtMilestone: Yup.number()
    .min(1, "Le temps passé doit être supérieur à 0")
    .required("Le temps passé est requis"),
  positionAtMilestone: Yup.string()
    .min(3, "La position doit contenir au moins 3 caractères")
    .required("La position est requise"),
  notesAtMilestone: Yup.string()
    .max(1000, "Maximum 1000 caractères")
});

// Schéma de validation pour la vérification d'email
export const verifyEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Adresse email invalide")
    .required("L'adresse email est requise")
});

// Types TypeScript pour les formulaires
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface MilestoneValidationFormValues {
  learningSummary: string;
  keyConcepts: string[];
  challenges: string;
  nextSteps: string;
  timeSpentAtMilestone: number;
  positionAtMilestone: string;
  notesAtMilestone: string;
}

export interface VerifyEmailFormValues {
  email: string;
}

// Valeurs initiales pour les formulaires
export const initialLoginValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: true
};

export const initialRegisterValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false
};

export const initialForgotPasswordValues: ForgotPasswordFormValues = {
  email: ""
};

export const initialResetPasswordValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: ""
};

export const initialSetPasswordValues: SetPasswordFormValues = {
  password: "",
  confirmPassword: ""
};

export const initialMilestoneValidationValues: MilestoneValidationFormValues = {
  learningSummary: "",
  keyConcepts: [],
  challenges: "",
  nextSteps: "",
  timeSpentAtMilestone: 0,
  positionAtMilestone: "",
  notesAtMilestone: ""
};

export const initialVerifyEmailValues: VerifyEmailFormValues = {
  email: ""
}; 