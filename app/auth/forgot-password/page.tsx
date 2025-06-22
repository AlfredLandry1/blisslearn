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
  Shield,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { 
  forgotPasswordSchema, 
  initialForgotPasswordValues, 
  type ForgotPasswordFormValues 
} from "@/lib/validation-schemas";

export default function ForgotPasswordPage() {
  const { setLoading, clearLoading, addNotification } = useUIStore();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const loadingKey = "forgot-password-form";
  const errorKey = "forgot-password-form-error";

  const handleSubmit = async (values: ForgotPasswordFormValues, { setSubmitting, resetForm }: any) => {
    setLoading(loadingKey, true);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        setUserEmail(values.email);
        setIsEmailSent(true);
        resetForm();
        
        addNotification({
          id: `email-sent-${Date.now()}`,
          type: "success",
          title: "Email envoyé",
          message: "Un email de réinitialisation a été envoyé à votre adresse.",
          duration: 5000
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      addNotification({
        id: `email-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: error instanceof Error ? error.message : "Impossible d'envoyer l'email de réinitialisation",
        duration: 5000
      });
    } finally {
      setLoading(loadingKey, false);
      setSubmitting(false);
    }
  };

  if (isEmailSent) {
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
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-blue-400 font-medium mt-2"
              >
                {userEmail}
              </motion.p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Prochaines étapes :</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Vérifiez votre boîte de réception</li>
                    <li>• Cliquez sur le lien de réinitialisation</li>
                    <li>• Créez votre nouveau mot de passe</li>
                    <li>• Le lien expire dans 1 heure</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsEmailSent(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer un autre email
                  </Button>
                  
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white py-4 text-base font-medium transition-all duration-300"
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
      </AuthLayout>
    );
  }

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
                Récupération de compte
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
            <ErrorDisplay errorKey={errorKey} variant="toast" />

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
                    <LoadingButton
                      loadingKey={loadingKey}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Envoyer le lien de réinitialisation</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </LoadingButton>
                  </motion.div>
                </Form>
              )}
            </Formik>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center"
            >
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white transition-colors"
                >
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