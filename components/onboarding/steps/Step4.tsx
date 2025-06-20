"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { StepProps } from "../types";

export function OnboardingStep4({ data, updateData, onNext, onPrev }: StepProps) {
  const handleHoursChange = (value: number[]) => {
    updateData({ weeklyHours: value[0] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateData({ weeklyHours: Math.min(Math.max(value, 0), 40) });
  };

  const isStepValid = data.weeklyHours > 0;

  const getTimeDescription = (hours: number) => {
    if (hours <= 2) return "Très peu de temps";
    if (hours <= 5) return "Quelques heures par semaine";
    if (hours <= 10) return "Temps modéré";
    if (hours <= 20) return "Temps conséquent";
    return "Temps important";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <Clock className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Combien d'heures par semaine pouvez-vous consacrer à votre apprentissage ?
        </h2>
        <p className="text-gray-400 text-sm">
          Cela nous aide à vous proposer des cours adaptés à votre disponibilité
        </p>
      </div>

      <div className="space-y-6">
        {/* Slider */}
        <div className="space-y-4">
          <Label htmlFor="weeklyHoursSlider" className="text-sm font-medium text-gray-300">
            Glissez le curseur ou saisissez directement
          </Label>
          <Slider
            id="weeklyHoursSlider"
            value={[data.weeklyHours]}
            onValueChange={handleHoursChange}
            max={40}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0h</span>
            <span>10h</span>
            <span>20h</span>
            <span>30h</span>
            <span>40h</span>
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <Label htmlFor="weeklyHours" className="text-sm font-medium text-gray-300">
            Heures par semaine
          </Label>
          <div className="relative">
            <Input
              id="weeklyHours"
              type="number"
              value={data.weeklyHours}
              onChange={handleInputChange}
              min={0}
              max={40}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              heures
            </span>
          </div>
        </div>

        {/* Description */}
        {data.weeklyHours > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
          >
            <p className="text-orange-400 text-sm font-medium mb-1">
              {data.weeklyHours} heure{data.weeklyHours > 1 ? 's' : ''} par semaine
            </p>
            <p className="text-orange-300 text-sm">
              {getTimeDescription(data.weeklyHours)}
            </p>
          </motion.div>
        )}

        {/* Suggestions */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-300 font-medium mb-2">Suggestions selon votre disponibilité :</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• <strong>1-2h/semaine :</strong> Cours courts et ciblés</li>
            <li>• <strong>3-5h/semaine :</strong> Formations progressives</li>
            <li>• <strong>6-10h/semaine :</strong> Programmes complets</li>
            <li>• <strong>10h+/semaine :</strong> Bootcamps intensifs</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isStepValid}
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
        >
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
} 