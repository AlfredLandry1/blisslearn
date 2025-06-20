"use client";

import { useState } from "react";
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

const TOTAL_STEPS = 7;

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
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
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateOnboardingData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
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
      // Envoyer les données d'onboarding à l'API
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde de l'onboarding");
      }

      const result = await response.json();
      console.log("Onboarding sauvegardé:", result);

      // Rediriger vers le dashboard après sauvegarde réussie
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'onboarding:", error);
      // Ici vous pourriez afficher un message d'erreur à l'utilisateur
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
      data: onboardingData,
      updateData: updateOnboardingData,
      onNext: nextStep,
      onPrev: prevStep
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