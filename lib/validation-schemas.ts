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
  acceptTerms: true
};

export const initialForgotPasswordValues: ForgotPasswordFormValues = {
  email: ""
}; 