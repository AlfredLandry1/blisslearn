"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { StepProps, DOMAINS_OF_INTEREST } from "../types";

export function OnboardingStep2({ data, updateData, onNext, onPrev, isLoading }: StepProps) {
  // Protection contre data null/undefined
  if (!data) {
    return <div>Chargement...</div>;
  }

  const handleDomainChange = (domain: string, checked: boolean) => {
    let newDomains = [...(data.domainsOfInterest || [])];
    
    if (checked) {
      newDomains.push(domain);
    } else {
      newDomains = newDomains.filter(d => d !== domain);
    }
    
    updateData({ domainsOfInterest: newDomains });
  };

  const isStepValid = (data.domainsOfInterest || []).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Quels domaines vous intéressent le plus ?
        </h2>
        <p className="text-gray-400 text-sm">
          Sélectionnez les domaines qui vous motivent pour recevoir des recommandations personnalisées
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOMAINS_OF_INTEREST.map((domain, index) => (
          <motion.div
            key={domain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Checkbox
              id={domain}
              checked={(data.domainsOfInterest || []).includes(domain)}
              onCheckedChange={(checked) => handleDomainChange(domain, checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor={domain} className="text-gray-300 leading-relaxed cursor-pointer flex-1">
              {domain}
            </Label>
          </motion.div>
        ))}
      </div>

      {(data.domainsOfInterest || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
        >
          <p className="text-green-400 text-sm font-medium mb-2">Domaines sélectionnés :</p>
          <div className="flex flex-wrap gap-2">
            {(data.domainsOfInterest || []).map((domain, index) => (
              <span
                key={index}
                className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded"
              >
                {domain}
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
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
         aria-label="Action">
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  );
} 