"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Target, BookOpen, TrendingUp, Clock, Monitor, Settings } from "lucide-react";
import { Step7Props, SKILL_LEVELS, COURSE_DURATIONS } from "../types";

export function OnboardingStep7({ data, onPrev, onSubmit, isLoading }: Step7Props) {
  const getSkillLevelLabel = (value: string) => {
    return SKILL_LEVELS.find(level => level.value === value)?.label || value;
  };

  const getDurationLabel = (value: string) => {
    return COURSE_DURATIONS.find(duration => duration.value === value)?.label || value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Récapitulatif de vos préférences
        </h2>
        <p className="text-gray-400 text-sm">
          Vérifiez vos réponses avant de recevoir vos recommandations personnalisées
        </p>
      </div>

      <div className="space-y-6">
        {/* Objectifs d'apprentissage */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <h3 className="text-blue-400 font-medium">Objectifs d'apprentissage</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.learningObjectives.map((objective, index) => (
              <span key={index} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                {objective}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Domaines d'intérêt */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="w-4 h-4 text-green-400" aria-hidden="true" />
            <h3 className="text-green-400 font-medium">Domaines d'intérêt</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.domainsOfInterest.map((domain, index) => (
              <span key={index} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                {domain}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Niveau de compétence */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <h3 className="text-purple-400 font-medium">Niveau de compétence</h3>
          </div>
          <p className="text-purple-300 text-sm">{getSkillLevelLabel(data.skillLevel)}</p>
        </motion.div>

        {/* Disponibilité horaire */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-orange-400" aria-hidden="true" />
            <h3 className="text-orange-400 font-medium">Disponibilité horaire</h3>
          </div>
          <p className="text-orange-300 text-sm">{data.weeklyHours} heure{data.weeklyHours > 1 ? 's' : ''} par semaine</p>
        </motion.div>

        {/* Plateformes préférées */}
        {data.preferredPlatforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Monitor className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <h3 className="text-indigo-400 font-medium">Plateformes préférées</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.preferredPlatforms.map((platform, index) => (
                <span key={index} className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded">
                  {platform}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Préférences de cours */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <h3 className="text-teal-400 font-medium">Préférences de cours</h3>
          </div>
          <div className="space-y-2 text-sm text-teal-300">
            <p>• Formats : {data.coursePreferences.format.join(", ")}</p>
            <p>• Durée : {getDurationLabel(data.coursePreferences.duration)}</p>
            <p>• Langue : {data.coursePreferences.language}</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Modifier
        </Button>
        
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Génération des recommandations...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              <span>Continuer vers mon tableau de bord</span>
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
} 