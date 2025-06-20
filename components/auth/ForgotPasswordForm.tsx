"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormikFieldWithIcon } from "@/components/ui/formik";
import { 
  Zap, 
  ArrowRight,
  ArrowLeft,
  Mail,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { 
  forgotPasswordSchema, 
  initialForgotPasswordValues, 
  type ForgotPasswordFormValues 
} from "@/lib/validation-schemas";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (values: ForgotPasswordFormValues, { setSubmitting }: any) => {
    setIsLoading(true);
    
    try {
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Email de réinitialisation envoyé à:", values.email);
      setIsEmailSent(true);
      // Ici vous ajouteriez votre logique d'envoi d'email
      
    } catch (error) {
      console.error("Erreur d'envoi d'email:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
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
              <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-2" />
                Email envoyé
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
            >
              Email envoyé !
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              Nous avons envoyé un lien de réinitialisation à votre adresse email.
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300 py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
                
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300 py-3"
                  >
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
            <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
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
                    className="mb-6"
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-4 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Envoyer le lien</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </Form>
            )}
          </Formik>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center text-sm text-gray-400 pt-6"
          >
            <Link
              href="/auth/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la connexion</span>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 