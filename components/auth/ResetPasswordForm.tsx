"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormikFieldWithIcon } from "@/components/ui/formik";
import { 
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { 
  resetPasswordSchema, 
  initialResetPasswordValues, 
  type ResetPasswordFormValues 
} from "@/lib/validation-schemas";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

export default function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromProps = searchParams?.get('token');
  
  const { setLoading, clearLoading, addNotification } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const loadingKey = "reset-password-form";
  const errorKey = "reset-password-form-error";

  // Vérifier la validité du token au chargement
  useEffect(() => {
    if (!tokenFromProps) {
      setIsTokenValid(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password/validate?token=${tokenFromProps}`);
        const data = await response.json();

        if (response.ok) {
          setIsTokenValid(true);
          setUserEmail(data.email);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Erreur lors de la validation du token:", error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [tokenFromProps]);

  const handleSubmit = async (values: ResetPasswordFormValues, { setSubmitting, resetForm }: any) => {
    if (!tokenFromProps) return;

    setLoading(loadingKey, true);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenFromProps,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsPasswordReset(true);
        resetForm();
        
        addNotification({
          id: `password-reset-success-${Date.now()}`,
          type: "success",
          title: "Mot de passe mis à jour",
          message: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
          duration: 5000
        });

        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        throw new Error(data.error || "Erreur lors de la réinitialisation du mot de passe");
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      addNotification({
        id: `password-reset-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: error instanceof Error ? error.message : "Impossible de réinitialiser le mot de passe",
        duration: 5000
      });
    } finally {
      setLoading(loadingKey, false);
      setSubmitting(false);
    }
  };

  // Token invalide ou manquant
  if (isTokenValid === false) {
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
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
                <Zap className="w-3 h-3 mr-2" />
                Lien invalide
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
            >
              Lien de réinitialisation invalide
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              Ce lien de réinitialisation est invalide, expiré ou a déjà été utilisé.
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-300">
                    <p className="font-medium mb-2">Que faire maintenant ?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Demandez un nouveau lien de réinitialisation</li>
                      <li>• Vérifiez que vous utilisez le bon lien</li>
                      <li>• Les liens expirent après 1 heure</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/forgot-password" className="flex-1">
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Nouvelle demande
                  </Button>
                </Link>
                
                <Link href="/auth/login" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
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

  // Mot de passe réinitialisé avec succès
  if (isPasswordReset) {
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
                Mot de passe mis à jour
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
            >
              Mot de passe réinitialisé !
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <Link href="/auth/login">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Aller à la connexion
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Chargement de la validation du token
  if (isTokenValid === null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Vérification du lien...
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Nous vérifions la validité de votre lien de réinitialisation.
            </p>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  // Formulaire de réinitialisation
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
              Nouveau mot de passe
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
          >
            Créer un nouveau mot de passe
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-sm sm:text-base"
          >
            {userEmail && `Pour le compte : ${userEmail}`}
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <ErrorDisplay errorKey={errorKey} variant="toast" />

          <Formik
            initialValues={initialResetPasswordValues}
            validationSchema={resetPasswordSchema}
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
                  {/* Nouveau mot de passe */}
                  <div className="relative">
                    <FormikFieldWithIcon
                      name="password"
                      label="Nouveau mot de passe"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      icon={Lock}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-8 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Confirmation du mot de passe */}
                  <div className="relative">
                    <FormikFieldWithIcon
                      name="confirmPassword"
                      label="Confirmer le mot de passe"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      icon={Lock}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-8 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Exigences du mot de passe */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Exigences du mot de passe :</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Au moins 8 caractères
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Au moins une lettre minuscule
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Au moins une lettre majuscule
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Au moins un chiffre
                      </li>
                    </ul>
                  </div>

                  {/* Bouton de soumission */}
                  <div className="pt-4">
                    <LoadingButton
                      loadingKey={loadingKey}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Réinitialiser le mot de passe</span>
                        <Lock className="w-4 h-4" />
                      </div>
                    </LoadingButton>
                  </div>
                </motion.div>
              </Form>
            )}
          </Formik>

          {/* Retour à la connexion */}
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