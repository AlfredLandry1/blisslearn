"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormikFieldWithIcon } from "@/components/ui/formik";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  verifyEmailSchema, 
  initialVerifyEmailValues, 
  type VerifyEmailFormValues 
} from "@/lib/validation-schemas";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useApiClient } from "@/hooks/useApiClient";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"waiting" | "pending" | "success" | "error">("waiting");
  const [message, setMessage] = useState<string>("");
  
  const { setLoading, clearLoading, setError, clearError, createPersistentNotification } = useUIStore();
  const loadingKey = "verify-email-form";
  const errorKey = "verify-email-form-error";

  const {
    loading: verifyLoading,
    error: verifyError,
    post: verifyEmail
  } = useApiClient<any>({
    onSuccess: (data) => {
      setStatus("success");
      setMessage("Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.");
      createPersistentNotification({
        type: 'success',
        title: 'Vérification email',
        message: 'Votre email a été vérifié avec succès'
      });
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Erreur lors de la vérification de l'email.");
      createPersistentNotification({
        type: 'error',
        title: 'Erreur de vérification',
        message: error.message
      });
    }
  });

  const {
    loading: resendLoading,
    error: resendError,
    post: resendVerification
  } = useApiClient<any>({
    onSuccess: (data) => {
      setMessage("Email de vérification renvoyé avec succès ! Vérifiez votre boîte email.");
      createPersistentNotification({
        type: 'success',
        title: 'Email renvoyé !',
        message: 'Un nouvel email de vérification a été envoyé'
      });
    },
    onError: (error) => {
      createPersistentNotification({
        type: 'error',
        title: 'Erreur d\'envoi',
        message: error.message
      });
    }
  });

  useEffect(() => {
    if (token) {
      // Si un token est fourni, valider l'email
      const verify = async () => {
        setStatus("pending");
        setMessage("");
        try {
          await verifyEmail('/api/auth/verify-email', {
            token: token
          });
        } catch (e) {
          setStatus("error");
          setMessage("Erreur réseau ou serveur. Veuillez réessayer plus tard.");
        }
      };
      verify();
    } else {
      // Si aucun token, afficher le message d'attente
      setStatus("waiting");
      setMessage("Veuillez vérifier votre boîte email et cliquer sur le lien de vérification.");
    }
  }, [token]);

  const handleResendEmail = async () => {
    try {
      await resendVerification('/api/auth/resend-verification');
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  // Si on a un token, afficher le statut de vérification
  if (token) {
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
                <Mail className="w-3 h-3 mr-2" />
                Vérification en cours
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
            >
              Vérification de l'email
            </motion.h1>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            {status === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-300 text-center">Vérification en cours...</p>
              </motion.div>
            )}
            
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <CheckCircle className="w-8 h-8 text-green-500" />
                <p className="text-green-400 text-center">{message}</p>
                <Button 
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              </motion.div>
            )}
            
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <XCircle className="w-8 h-8 text-red-500" />
                <p className="text-red-400 text-center">{message}</p>
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/auth/register")}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Retour à l'inscription
                  </Button>
                  <Button 
                    onClick={() => router.push("/auth/login")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Aller à la connexion
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Si pas de token, afficher le formulaire de renvoi
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
              <Mail className="w-3 h-3 mr-2" />
              Vérification requise
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
            {message}
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <ErrorDisplay errorKey={errorKey} variant="toast" />

          {/* Message de succès */}
          {message && message.includes("renvoyé avec succès") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
            >
              <p className="text-green-400 text-sm">{message}</p>
            </motion.div>
          )}

          <Formik
            initialValues={initialVerifyEmailValues}
            validationSchema={verifyEmailSchema}
            onSubmit={handleResendEmail}
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
                    className="mb-6"
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
                        <RefreshCw className="w-4 h-4" />
                        <span>Renvoyer l'email de vérification</span>
                      </div>
                    </LoadingButton>
                  </div>
                </motion.div>
              </Form>
            )}
          </Formik>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <Button 
              onClick={() => router.push("/auth/login")}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Aller à la connexion
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 