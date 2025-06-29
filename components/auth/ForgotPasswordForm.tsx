"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormikFieldWithIcon } from "@/components/ui/formik";
import { 
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { 
  forgotPasswordSchema, 
  initialForgotPasswordValues, 
  type ForgotPasswordFormValues 
} from "@/lib/validation-schemas";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { setLoading, clearLoading, setError, clearError, addNotification } = useUIStore();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const loadingKey = "forgot-password-form";
  const errorKey = "forgot-password-form-error";

  const handleSubmit = async (values: ForgotPasswordFormValues, { setSubmitting, resetForm }: any) => {
    setLoading(loadingKey, true);
    clearError(errorKey);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      // Gérer les erreurs de réponse
      if (!response.ok) {
        let errorMessage = "Erreur lors de l'envoi de l'email";
        
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (parseError) {
          // Si on ne peut pas parser la réponse JSON, utiliser le message par défaut
        }
        
        // Gestion spécifique des erreurs selon le code de statut
        if (response.status === 404) {
          errorMessage = "Aucun compte trouvé avec cette adresse email. Vérifiez votre saisie ou créez un nouveau compte.";
        } else if (response.status === 400) {
          if (errorMessage.includes("Google")) {
            errorMessage = "Ce compte utilise la connexion Google. Utilisez le bouton 'Se connecter avec Google' pour accéder à votre compte.";
          } else if (errorMessage.includes("Format")) {
            errorMessage = "Format d'email invalide. Veuillez saisir une adresse email valide.";
          }
        } else if (response.status === 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard ou contactez notre support.";
        }
        
        setError(errorKey, errorMessage);
        return;
      }

      // Traitement de la réponse réussie
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // Si on ne peut pas parser la réponse JSON, utiliser des valeurs par défaut
        data = { message: "Un email de réinitialisation a été envoyé à votre adresse email." };
      }

      setIsEmailSent(true);
      setUserEmail(values.email);
      resetForm();
      
      addNotification({
        id: `password-reset-${Date.now()}`,
        type: "success",
        title: "Email envoyé",
        message: data.message || "Un email de réinitialisation a été envoyé à votre adresse email.",
        duration: 5000
      });
      
    } catch (error) {
      // Gestion des erreurs réseau ou autres erreurs
      let errorMessage = "Impossible d'envoyer l'email de réinitialisation";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Erreur de connexion. Vérifiez votre connexion internet et réessayez.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorKey, errorMessage);
    } finally {
      setLoading(loadingKey, false);
      setSubmitting(false);
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setUserEmail("");
  };

  if (isEmailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
                <Zap className="w-3 h-3 mr-2" />
                Email envoyé
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
            >
              Vérifiez votre email
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              Nous avons envoyé un lien de réinitialisation à :
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-3"
            >
              <span className="text-blue-400 font-medium">{userEmail}</span>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-2">Instructions :</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Vérifiez votre boîte de réception et vos spams</li>
                      <li>• Cliquez sur le lien dans l'email</li>
                      <li>• Créez votre nouveau mot de passe</li>
                      <li>• Le lien expire dans 1 heure</li>
                      <li>• Vous recevrez un email de confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer l'email
                </Button>
                
                <Link href="/auth/login" className="flex-1">
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Zap className="w-3 h-3 mr-2" />
              Mot de passe oublié
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
          >
            Mot de passe oublié ?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-sm sm:text-base"
          >
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <ErrorDisplay errorKey={errorKey} variant="inline" />

          <Formik
            initialValues={initialForgotPasswordValues}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-6"
                >
                  {/* Email Field */}
                  <FormikFieldWithIcon
                    name="email"
                    label="Adresse email"
                    type="email"
                    placeholder="votre@email.com"
                    icon={Mail}
                    required
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <LoadingButton
                      loadingKey={loadingKey}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Envoyer le lien de réinitialisation</span>
                        <Mail className="w-4 h-4" />
                      </div>
                    </LoadingButton>
                  </div>
                </motion.div>
              </Form>
            )}
          </Formik>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center text-sm text-gray-400"
          >
            <span>Vous vous souvenez de votre mot de passe ? </span>
            <Link
              href="/auth/login"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Se connecter
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 