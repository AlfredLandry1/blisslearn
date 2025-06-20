"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { Particles } from "@/components/ui/particles";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const getErrorDetails = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return {
          title: "Erreur de configuration",
          message: "Il y a un problème avec la configuration du serveur d'authentification. Vérifiez les variables d'environnement Google OAuth.",
          icon: AlertTriangle,
        };
      case "AccessDenied":
        return {
          title: "Accès refusé",
          message: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
          icon: AlertTriangle,
        };
      case "Verification":
        return {
          title: "Erreur de vérification",
          message: "Le lien de vérification a expiré ou est invalide.",
          icon: AlertTriangle,
        };
      case "OAuthAccountNotLinked":
        return {
          title: "Compte non lié",
          message: "Un compte existe déjà avec cet email. Connectez-vous avec votre mot de passe, puis liez votre compte Google dans les paramètres.",
          icon: AlertTriangle,
        };
      case "OAuthSignin":
        return {
          title: "Erreur de connexion OAuth",
          message: "Une erreur s'est produite lors de la connexion avec Google. Veuillez réessayer.",
          icon: AlertTriangle,
        };
      case "OAuthCallback":
        return {
          title: "Erreur de callback OAuth",
          message: "Une erreur s'est produite lors du retour de Google. Veuillez réessayer.",
          icon: AlertTriangle,
        };
      case "OAuthCreateAccount":
        return {
          title: "Erreur de création de compte",
          message: "Impossible de créer votre compte avec Google. Veuillez réessayer.",
          icon: AlertTriangle,
        };
      case "EmailCreateAccount":
        return {
          title: "Erreur de création de compte",
          message: "Impossible de créer votre compte avec cet email. Veuillez réessayer.",
          icon: AlertTriangle,
        };
      case "Callback":
        return {
          title: "Erreur de callback",
          message: "Une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer.",
          icon: AlertTriangle,
        };
      case "Default":
        return {
          title: "Erreur d'authentification",
          message: "Une erreur inattendue s'est produite lors de l'authentification.",
          icon: AlertTriangle,
        };
      default:
        return {
          title: "Erreur inconnue",
          message: "Une erreur s'est produite. Veuillez réessayer.",
          icon: AlertTriangle,
        };
    }
  };

  const errorDetails = getErrorDetails(error || null);
  const ErrorIcon = errorDetails.icon;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <SpaceBackground />
      <Particles />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <ErrorIcon className="w-8 h-8 text-red-400" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {errorDetails.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-gray-400 text-sm"
            >
              {errorDetails.message}
            </motion.p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-4"
            >
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Code d'erreur: <span className="font-mono">{error || "Inconnu"}</span>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col space-y-3">
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Action">
                  <Link href="/auth/login">
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Retour à la connexion
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Action">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                    Retour à l'accueil
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  onClick={() => window.location.reload()}
                  aria-label="Action"
                >
                  <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                  Actualiser la page
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Si le problème persiste, contactez notre support technique.
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 