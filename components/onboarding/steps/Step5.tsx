"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Monitor } from "lucide-react";
import { StepProps, PREFERRED_PLATFORMS } from "../types";

export function OnboardingStep5({ data, updateData, onNext, onPrev, isLoading }: StepProps) {
  // Protection contre data null/undefined
  if (!data) {
    return <div>Chargement...</div>;
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    let newPlatforms = [...(data.preferredPlatforms || [])];
    
    if (checked) {
      newPlatforms.push(platform);
    } else {
      newPlatforms = newPlatforms.filter(p => p !== platform);
    }
    
    updateData({ preferredPlatforms: newPlatforms });
  };

  // Cette étape est facultative, donc toujours valide
  // const isStepValid = true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <Monitor className="w-12 h-12 text-indigo-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Plateformes préférées <span className="text-indigo-400">(facultatif)</span>
        </h2>
        <p className="text-gray-400 text-sm">
          Avez-vous des plateformes d'apprentissage que vous préférez ? 
          <br />
          <span className="text-gray-500 text-xs">Vous pouvez passer cette étape si vous n'avez pas de préférence</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREFERRED_PLATFORMS.map((platform, index) => (
          <motion.div
            key={platform}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Checkbox
              id={platform}
              checked={(data.preferredPlatforms || []).includes(platform)}
              onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor={platform} className="text-gray-300 leading-relaxed cursor-pointer flex-1">
              {platform}
            </Label>
          </motion.div>
        ))}
      </div>

      {(data.preferredPlatforms || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4"
        >
          <p className="text-indigo-400 text-sm font-medium mb-2">Plateformes sélectionnées :</p>
          <div className="flex flex-wrap gap-2">
            {(data.preferredPlatforms || []).map((platform, index) => (
              <span
                key={index}
                className="bg-indigo-400/20 text-indigo-300 text-xs px-2 py-1 rounded"
              >
                {platform}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Info box */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
        <h3 className="text-gray-300 font-medium mb-2">💡 Pourquoi cette question ?</h3>
        <p className="text-gray-400 text-sm">
          Connaître vos plateformes préférées nous aide à vous proposer des cours 
          sur les plateformes que vous utilisez déjà, ou à vous faire découvrir 
          de nouvelles plateformes qui pourraient vous plaire.
        </p>
      </div>

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
        
        <div className="flex space-x-3">
          <Button
            onClick={onNext}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
           aria-label="Action">
            Passer cette étape
          </Button>
          
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
           aria-label="Action">
            Suivant
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 