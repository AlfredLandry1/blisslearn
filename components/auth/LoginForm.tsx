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
  Lock
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { GoogleButton } from "./GoogleButton";
import { 
  loginSchema, 
  initialLoginValues, 
  type LoginFormValues 
} from "@/lib/validation-schemas";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";

export function LoginForm() {
  const { login } = useAuth();
  const { setLoading, clearLoading, setError, clearError } = useUIStore();

  const loadingKey = "login-form";
  const errorKey = "login-form-error";

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
    setLoading(loadingKey, true);
    clearError(errorKey);
    
    try {
      const result = await login(values.email, values.password);

      if (!result.success) {
        setError(errorKey, result.error || "Email ou mot de passe incorrect");
      }
      // Si la connexion réussit, le hook useAuth gère la redirection
      
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError(errorKey, "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(loadingKey, false);
      setSubmitting(false);
    }
  };

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
              Connexion sécurisée
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
          >
            Bienvenue de retour
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-sm sm:text-base"
          >
            Connectez-vous à votre compte BlissLearn
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <ErrorDisplay errorKey={errorKey} variant="toast" />

          <Formik
            initialValues={initialLoginValues}
            validationSchema={loginSchema}
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
                    className="mb-6"
                  />

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm pt-2">
                    <FormikCheckbox
                      name="rememberMe"
                      label="Se souvenir de moi"
                    />
                    <Link
                      href="/auth/forgot-password"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <LoadingButton
                      loadingKey={loadingKey}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Se connecter</span>
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

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center text-sm text-gray-400"
          >
            <span>Pas encore de compte ? </span>
            <Link
              href="/auth/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 