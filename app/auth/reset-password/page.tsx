"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { 
  resetPasswordSchema, 
  initialResetPasswordValues, 
  type ResetPasswordFormValues 
} from "@/lib/validation-schemas";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoading, clearLoading, addNotification } = useUIStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams?.get('token');
  const loadingKey = "reset-password-form";
  const errorKey = "reset-password-form-error";

  // Vérifier la validité du token au chargement
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password/validate?token=${token}`);
        if (response.ok) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        console.error("Erreur lors de la validation du token:", error);
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (values: ResetPasswordFormValues, { setSubmitting, resetForm }: any) => {
    if (!token) return;

    setLoading(loadingKey, true);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        resetForm();
        
        addNotification({
          id: `password-reset-${Date.now()}`,
          type: "success",
          title: "Mot de passe mis à jour",
          message: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
          duration: 5000
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la réinitialisation du mot de passe");
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      addNotification({
        id: `reset-error-${Date.now()}`,
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

  // Page de succès
  if (isSuccess) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
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
                  <Shield className="w-3 h-3 mr-2" />
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
                Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </motion.p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-3"
              >
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105">
                    <Lock className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AuthLayout>
    );
  }

  // Token invalide ou expiré
  if (tokenValid === false) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
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
                  <Shield className="w-3 h-3 mr-2" />
                  Lien invalide
                </Badge>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-3"
              >
                Lien expiré ou invalide
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 text-sm sm:text-base"
              >
                Ce lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.
              </motion.p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-3"
              >
                <Link href="/auth/forgot-password">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105">
                    <Lock className="w-4 h-4 mr-2" />
                    Demander un nouveau lien
                  </Button>
                </Link>
                
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white py-4 text-base font-medium transition-all duration-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AuthLayout>
    );
  }

  // Chargement de la validation du token
  if (tokenValid === null) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Vérification du lien...</p>
        </div>
      </AuthLayout>
    );
  }

  // Formulaire de réinitialisation
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
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
                <Shield className="w-3 h-3 mr-2" />
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
              Choisissez un nouveau mot de passe sécurisé pour votre compte.
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

                    {/* Boutons d'action */}
                    <div className="space-y-4 pt-2">
                      <LoadingButton
                        loadingKey={loadingKey}
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>Réinitialiser le mot de passe</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </LoadingButton>
                      
                      <Link href="/auth/login">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white py-4 text-base font-medium transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Retour à la connexion
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
} 