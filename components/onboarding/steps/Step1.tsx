"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import { StepProps, LEARNING_OBJECTIVES } from "../types";

export function OnboardingStep1({ data, updateData, onNext, onPrev, isLoading }: StepProps) {
  const [customObjective, setCustomObjective] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Protection contre data null/undefined
  if (!data) {
    return <div>Chargement...</div>;
  }

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    let newObjectives = [...(data.learningObjectives || [])];
    
    if (objective === "Autre") {
      if (checked) {
        setShowCustomInput(true);
      } else {
        setShowCustomInput(false);
        setCustomObjective("");
        newObjectives = newObjectives.filter(obj => obj !== customObjective);
      }
    } else {
      if (checked) {
        newObjectives.push(objective);
      } else {
        newObjectives = newObjectives.filter(obj => obj !== objective);
      }
    }
    
    updateData({ learningObjectives: newObjectives });
  };

  const handleCustomObjectiveChange = (value: string) => {
    setCustomObjective(value);
    let newObjectives = (data.learningObjectives || []).filter(obj => !LEARNING_OBJECTIVES.includes(obj));
    if (value.trim()) {
      newObjectives.push(value.trim());
    }
    updateData({ learningObjectives: newObjectives });
  };

  const isStepValid = (data.learningObjectives || []).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Quel est votre principal objectif d'apprentissage ?
        </h2>
        <p className="text-gray-400 text-sm">
          Choisissez un ou plusieurs objectifs qui vous motivent le plus
        </p>
      </div>

      <div className="space-y-4">
        {LEARNING_OBJECTIVES.map((objective, index) => (
          <motion.div
            key={objective}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Checkbox
              id={objective}
              checked={(data.learningObjectives || []).includes(objective) || (objective === "Autre" && showCustomInput)}
              onCheckedChange={(checked) => handleObjectiveChange(objective, checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor={objective} className="text-gray-300 leading-relaxed cursor-pointer flex-1">
              {objective}
            </Label>
          </motion.div>
        ))}

        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <Label htmlFor="customObjective" className="text-sm font-medium text-gray-300">
              Précisez votre objectif
            </Label>
            <Input
              id="customObjective"
              value={customObjective}
              onChange={(e) => handleCustomObjectiveChange(e.target.value)}
              placeholder="Ex: Devenir expert en blockchain..."
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </motion.div>
        )}
      </div>

      {(data.learningObjectives || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
        >
          <p className="text-blue-400 text-sm font-medium mb-2">Objectifs sélectionnés :</p>
          <div className="flex flex-wrap gap-2">
            {(data.learningObjectives || []).map((objective, index) => (
              <span
                key={index}
                className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded"
              >
                {objective}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Précédent
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isStepValid || isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  );
} 