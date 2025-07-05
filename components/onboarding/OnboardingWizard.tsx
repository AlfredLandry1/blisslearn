"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {  Target, CheckCircle } from "lucide-react";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { Particles } from "@/components/ui/particles";
import { OnboardingStep1 } from "./steps/Step1";
import { OnboardingStep2 } from "./steps/Step2";
import { OnboardingStep3 } from "./steps/Step3";
import { OnboardingStep4 } from "./steps/Step4";
import { OnboardingStep5 } from "./steps/Step5";
import { OnboardingStep6 } from "./steps/Step6";
import { OnboardingStep7 } from "./steps/Step7";
import { OnboardingData } from "./types";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useUIStore } from "@/stores/uiStore";
import { useApiClient } from "@/hooks/useApiClient";
import { signOut, signIn } from "next-auth/react";

const TOTAL_STEPS = 7;

export function OnboardingWizard() {
  const router = useRouter();
  const { updateOnboardingStatus } = useUserStore();
  const { createPersistentNotification } = useUIStore();
  const [currentStep, setCurrentStep] = useState(1);
  const {
    data: onboardingData,
    loading: onboardingLoading,
    error: onboardingError,
    post: postOnboarding,
    get: getOnboarding,
  } = useApiClient<any>({
    onError: (error) => {
      createPersistentNotification({
        type: "error",
        title: "Erreur",
        message: error.message || "Erreur lors de la sauvegarde de l'onboarding",
        duration: 5000,
      });
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialiser les données par défaut pour éviter les erreurs null
  const defaultOnboardingData: OnboardingData = {
    learningObjectives: [],
    domainsOfInterest: [],
    skillLevel: "",
    weeklyHours: 0,
    preferredPlatforms: [],
    coursePreferences: {
      format: [],
      duration: "",
      language: ""
    }
  };

  // Utiliser les données existantes ou les données par défaut
  const currentData = onboardingData || defaultOnboardingData;

  const [localData, setLocalData] = useState<OnboardingData>(defaultOnboardingData);

  // Charger les données d'onboarding existantes au démarrage
  useEffect(() => {
    getOnboarding('/api/onboarding');
  }, []);

  // Initialiser localData avec les données existantes si disponibles
  useEffect(() => {
    if (onboardingData?.data?.onboardingData) {
      setLocalData({ ...defaultOnboardingData, ...onboardingData.data.onboardingData });
      // Si l'onboarding est déjà complété, afficher un message au lieu de rediriger
      if (onboardingData.data.onboardingCompleted) {
        console.log("ℹ️ Onboarding déjà complété, affichage du récapitulatif");
        // Ne pas rediriger automatiquement, laisser l'utilisateur voir le récapitulatif
      }
    }
  }, [onboardingData]);

  const updateOnboardingData = (stepData: Partial<OnboardingData>) => {
    const newData = { ...localData, ...stepData };
    setLocalData(newData);
    
    // Sauvegarder les données à chaque étape
    const saveStepData = async () => {
      try {
        await postOnboarding('/api/onboarding', {
          data: newData,
          step: currentStep,
          completed: false
        });
      } catch (error) {
        // Erreur déjà gérée par le client API
      }
    };
    
    // Sauvegarder en arrière-plan
    saveStepData();
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await postOnboarding("/api/onboarding", {
        data: localData,
        step: 7,
        completed: true
      });
      
      if (!response?.data) {
        throw new Error("Erreur lors de la sauvegarde de l'onboarding");
      }
      
      const result = response.data;
      console.log("Onboarding sauvegardé:", result);
      updateOnboardingStatus(true);
      createPersistentNotification({
        type: "success",
        title: "Onboarding complété !",
        message: "Votre profil d'apprentissage a été configuré avec succès. Vous pouvez maintenant commencer votre parcours d'apprentissage personnalisé.",
        duration: 5000
      });
      
      // Forcer la mise à jour de la session
      await signOut({ redirect: false });
      await signIn();
      
      router.push("/dashboard");
    } catch (error) {
      // Erreur déjà gérée par le client API
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = (step: number) => {
    const titles = {
      1: "Objectifs d'apprentissage",
      2: "Domaines d'intérêt",
      3: "Niveau de compétence",
      4: "Disponibilité horaire",
      5: "Plateformes préférées",
      6: "Préférences de cours",
      7: "Récapitulatif"
    };
    return titles[step as keyof typeof titles];
  };

  const getStepIcon = (step: number) => {
    const icons = {
      1: Target,
      2: Target,
      3: Target,
      4: Target,
      5: Target,
      6: Target,
      7: CheckCircle
    };
    return icons[step as keyof typeof icons];
  };

  const renderStep = () => {
    const commonProps = {
      data: localData,
      updateData: updateOnboardingData,
      onNext: nextStep,
      onPrev: prevStep,
      isLoading: isLoading
    };

    switch (currentStep) {
      case 1:
        return <OnboardingStep1 {...commonProps} />;
      case 2:
        return <OnboardingStep2 {...commonProps} />;
      case 3:
        return <OnboardingStep3 {...commonProps} />;
      case 4:
        return <OnboardingStep4 {...commonProps} />;
      case 5:
        return <OnboardingStep5 {...commonProps} />;
      case 6:
        return <OnboardingStep6 {...commonProps} />;
      case 7:
        return <OnboardingStep7 {...commonProps} onSubmit={handleSubmit} isLoading={isLoading} />;
      default:
        return <OnboardingStep1 {...commonProps} />;
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;
  const StepIcon = getStepIcon(currentStep);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <SpaceBackground />
      <Particles />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Étape {currentStep} sur {TOTAL_STEPS}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-700" />
            </div>

            {/* Step Header */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                <StepIcon className="w-3 h-3 mr-2" />
                {getStepTitle(currentStep)}
              </Badge>
            </motion.div>

            <motion.h1
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
            >
              {getStepTitle(currentStep)}
            </motion.h1>

            <motion.p
              key={`subtitle-${currentStep}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              Aidez-nous à personnaliser votre expérience d'apprentissage
            </motion.p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 