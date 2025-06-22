"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormikFieldWithIcon, FormikField, FormikCheckbox } from "@/components/ui/formik";
import { 
  Zap, 
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleButton } from "./GoogleButton";
import { 
  registerSchema, 
  initialRegisterValues, 
  type RegisterFormValues 
} from "@/lib/validation-schemas";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";

export function RegisterForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { setLoading, clearLoading, setError, clearError } = useUIStore();

  const loadingKey = "register-form";
  const errorKey = "register-form-error";

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: any) => {
    setLoading(loadingKey, true);
    clearError(errorKey);
    setSuccess(null);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(errorKey, data.error || "Erreur lors de l'inscription");
      } else {
        setSuccess("Compte créé avec succès ! Redirection vers la connexion...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
      
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setError(errorKey, "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(loadingKey, false);
      setSubmitting(false);
    }
  };

  const passwordRequirements = [
    { label: "Au moins 8 caractères", met: (password: string) => password.length >= 8 },
    { label: "Une lettre majuscule", met: (password: string) => /[A-Z]/.test(password) },
    { label: "Une lettre minuscule", met: (password: string) => /[a-z]/.test(password) },
    { label: "Un chiffre", met: (password: string) => /\d/.test(password) },
    { label: "Un caractère spécial", met: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-8"
    >
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
              <Zap className="w-3 h-3 mr-2" />
              Créer un compte
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
          >
            Rejoignez BlissLearn
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-sm sm:text-base"
          >
            Commencez votre voyage d'apprentissage dès aujourd'hui
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <ErrorDisplay errorKey={errorKey} variant="toast" />

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
            >
              <p className="text-green-400 text-sm">{success}</p>
            </motion.div>
          )}

          <Formik
            initialValues={initialRegisterValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, values }) => (
              <Form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormikFieldWithIcon
                      name="firstName"
                      label="Prénom"
                      type="text"
                      placeholder="Prénom"
                      icon={User}
                      required
                    />
                    
                    <FormikFieldWithIcon
                      name="lastName"
                      label="Nom"
                      type="text"
                      placeholder="Nom"
                      icon={User}
                      required
                    />
                  </div>

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

                  {/* Password Field */}
                  <FormikFieldWithIcon
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    showPasswordToggle
                    required
                    className="mb-4"
                  />

                  {/* Confirm Password Field */}
                  <FormikFieldWithIcon
                    name="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    showPasswordToggle
                    required
                    className="mb-4"
                  />
                  
                  {/* Password Requirements */}
                  {values.password.length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-gray-300 font-medium">Exigences du mot de passe :</p>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle 
                              className={`w-3 h-3 ${req.met(values.password) ? 'text-green-400' : 'text-gray-500'}`} 
                            />
                            <span className={req.met(values.password) ? 'text-green-400' : 'text-gray-400'}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Password Confirmation Check */}
                      {values.confirmPassword.length > 0 && (
                        <div className="pt-2 border-t border-gray-700">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle 
                              className={`w-3 h-3 ${values.password === values.confirmPassword ? 'text-green-400' : 'text-gray-500'}`} 
                            />
                            <span className={values.password === values.confirmPassword ? 'text-green-400' : 'text-gray-400'}>
                              Les mots de passe correspondent
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <FormikCheckbox
                    name="acceptTerms"
                    label="J'accepte les conditions d'utilisation et la politique de confidentialité"
                    required
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <LoadingButton
                      loadingKey={loadingKey}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Créer mon compte</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </LoadingButton>
                  </div>
                </motion.div>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative py-4"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">Ou continuer avec</span>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <GoogleButton />
          </motion.div>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center text-sm text-gray-400"
          >
            <span>Déjà un compte ? </span>
            <Link
              href="/auth/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Se connecter
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 