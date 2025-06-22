"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";
import { StepProps, SKILL_LEVELS } from "../types";

export function OnboardingStep3({ data, updateData, onNext, onPrev }: StepProps) {
  const handleSkillLevelChange = (value: string) => {
    updateData({ skillLevel: value });
  };

  const isStepValid = data.skillLevel !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Quel est votre niveau de compétence actuel ?
        </h2>
        <p className="text-gray-400 text-sm">
          Cela nous aide à vous proposer des cours adaptés à votre niveau
        </p>
      </div>

      <RadioGroup
        value={data.skillLevel}
        onValueChange={handleSkillLevelChange}
        className="space-y-4"
      >
        {SKILL_LEVELS.map((level, index) => (
          <motion.div
            key={level.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => handleSkillLevelChange(level.value)}
          >
            <RadioGroupItem
              value={level.value}
              id={level.value}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor={level.value} className="text-gray-300 font-medium cursor-pointer">
                {level.label}
              </Label>
              <p className="text-gray-400 text-sm mt-1">
                {level.description}
              </p>
            </div>
          </motion.div>
        ))}
      </RadioGroup>

      {data.skillLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4"
        >
          <p className="text-purple-400 text-sm font-medium">
            Niveau sélectionné : <span className="text-purple-300">
              {SKILL_LEVELS.find(level => level.value === data.skillLevel)?.label}
            </span>
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Précédent
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isStepValid}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  );
} 