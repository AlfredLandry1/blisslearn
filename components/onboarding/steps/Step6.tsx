"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { StepProps, COURSE_FORMATS, COURSE_DURATIONS, LANGUAGES } from "../types";

export function OnboardingStep6({ data, updateData, onNext, onPrev }: StepProps) {
  const handleFormatChange = (format: string, checked: boolean) => {
    let newFormats = [...data.coursePreferences.format];
    
    if (checked) {
      newFormats.push(format);
    } else {
      newFormats = newFormats.filter(f => f !== format);
    }
    
    updateData({
      coursePreferences: {
        ...data.coursePreferences,
        format: newFormats
      }
    });
  };

  const handleDurationChange = (duration: string) => {
    updateData({
      coursePreferences: {
        ...data.coursePreferences,
        duration
      }
    });
  };

  const handleLanguageChange = (language: string) => {
    updateData({
      coursePreferences: {
        ...data.coursePreferences,
        language
      }
    });
  };

  const isStepValid = data.coursePreferences.format.length > 0 && 
                     data.coursePreferences.duration !== "" && 
                     data.coursePreferences.language !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <Settings className="w-12 h-12 text-teal-400 mx-auto mb-4" / aria-hidden="true">
        <h2 className="text-xl font-semibold text-white mb-2">
          Quelles sont vos préférences de cours ?
        </h2>
        <p className="text-gray-400 text-sm">
          Aidez-nous à affiner les suggestions selon vos préférences pédagogiques
        </p>
      </div>

      <div className="space-y-8">
        {/* Format de cours */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-300">
            Format de cours préféré *
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COURSE_FORMATS.map((format, index) => (
              <motion.div
                key={format}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Checkbox
                  id={format}
                  checked={data.coursePreferences.format.includes(format)}
                  onCheckedChange={(checked) => handleFormatChange(format, checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor={format} className="text-gray-300 leading-relaxed cursor-pointer flex-1">
                  {format}
                </Label>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Durée idéale */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-300">
            Durée idéale d'un cours *
          </Label>
          <RadioGroup
            value={data.coursePreferences.duration}
            onValueChange={handleDurationChange}
            className="space-y-3"
          >
            {COURSE_DURATIONS.map((duration, index) => (
              <motion.div
                key={duration.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={() => handleDurationChange(duration.value)}
              >
                <RadioGroupItem
                  value={duration.value}
                  id={duration.value}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor={duration.value} className="text-gray-300 font-medium cursor-pointer">
                    {duration.label}
                  </Label>
                  <p className="text-gray-400 text-sm mt-1">
                    {duration.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </RadioGroup>
        </div>

        {/* Langue préférée */}
        <div className="space-y-4">
          <Label htmlFor="language" className="text-sm font-medium text-gray-300">
            Langue préférée *
          </Label>
          <Select value={data.coursePreferences.language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language" className="bg-gray-800/50 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500/20">
              <SelectValue placeholder="Sélectionnez une langue" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language} className="text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Résumé des préférences */}
        {(data.coursePreferences.format.length > 0 || data.coursePreferences.duration || data.coursePreferences.language) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4"
          >
            <p className="text-teal-400 text-sm font-medium mb-2">Vos préférences :</p>
            <div className="space-y-1 text-sm text-teal-300">
              {data.coursePreferences.format.length > 0 && (
                <p>• Formats : {data.coursePreferences.format.join(", ")}</p>
              )}
              {data.coursePreferences.duration && (
                <p>• Durée : {COURSE_DURATIONS.find(d => d.value === data.coursePreferences.duration)?.label}</p>
              )}
              {data.coursePreferences.language && (
                <p>• Langue : {data.coursePreferences.language}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          <ArrowLeft className="w-4 h-4 mr-2" / aria-hidden="true">
          Précédent
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isStepValid || isLoading}
          className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" / aria-hidden="true">
        </Button>
      </div>
    </motion.div>
  );
} 