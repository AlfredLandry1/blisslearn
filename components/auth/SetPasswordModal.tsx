"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormikFieldWithIcon, FormikField } from "@/components/ui/formik";
import { 
  Lock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { 
  setPasswordSchema, 
  initialSetPasswordValues, 
  type SetPasswordFormValues 
} from "@/lib/validation-schemas";

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SetPasswordModal({ isOpen, onClose, onSuccess }: SetPasswordModalProps) {
  const { setLoading, clearLoading, addNotification } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loadingKey = "set-password-modal";
  const errorKey = "set-password-modal-error";

  const handleSubmit = async (values: SetPasswordFormValues, { setSubmitting, resetForm }: any) => {
    setLoading(loadingKey, true);
    
    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: values.password,
        }),
      });

      if (response.ok) {
        addNotification({
          id: `password-set-${Date.now()}`,
          type: "success",
          title: "Mot de passe configuré",
          message: "Votre mot de passe a été configuré avec succès. Vous pouvez maintenant vous connecter sans Google.",
          duration: 5000
        });
        
        resetForm();
        onSuccess?.();
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la configuration du mot de passe");
      }
    } catch (error) {
      console.error("Erreur lors de la configuration du mot de passe:", error);
      addNotification({
        id: `password-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: error instanceof Error ? error.message : "Impossible de configurer le mot de passe",
        duration: 5000
      });
    } finally {
      setLoading(loadingKey, false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <Badge className="mb-3 bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Shield className="w-3 h-3 mr-2" />
              Configuration du mot de passe
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DialogTitle className="text-xl font-bold text-white mb-2">
              Configurer votre mot de passe
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Configurez un mot de passe pour pouvoir vous connecter sans Google à l'avenir.
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <div className="space-y-6">
          <ErrorDisplay errorKey={errorKey} variant="inline" />

          <Formik
            initialValues={initialSetPasswordValues}
            validationSchema={setPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-4"
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
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Annuler
                    </Button>
                    <LoadingButton
                      loadingKey={loadingKey}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Configurer
                    </LoadingButton>
                  </div>
                </motion.div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
} 