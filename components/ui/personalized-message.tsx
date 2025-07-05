"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Target, 
  Trophy, 
  Star, 
  Zap, 
  TrendingUp, 
  Lightbulb,
  X,
  RefreshCw,
  EyeOff,
  Eye
} from "lucide-react";
import { useAchievementMessage, useMotivationContent, useProgressMessage } from "@/hooks/usePersonalizedContent";
import { motion, AnimatePresence } from "framer-motion";

interface PersonalizedMessageProps {
  type: 'achievement' | 'motivation' | 'progress' | 'welcome';
  className?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function PersonalizedMessage({ 
  type, 
  className = "",
  showRefresh = false,
  onRefresh,
  autoHide = false,
  autoHideDelay = 5000,
  dismissible = false,
  onDismiss
}: PersonalizedMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Vérifier si le message a été dismissé dans le localStorage
  useEffect(() => {
    if (dismissible) {
      const dismissedKey = `dismissed_${type}_message`;
      const dismissed = localStorage.getItem(dismissedKey);
      if (dismissed === 'true') {
        setIsDismissed(true);
        setIsVisible(false);
      }
    }
  }, [dismissible, type]);

  // Hooks IA personnalisés avec gestion d'erreur
  const { achievementMessage, loading: achievementLoading, error: achievementError } = useAchievementMessage();
  const { motivationQuote, dailyGoal, loading: motivationLoading, error: motivationError } = useMotivationContent();
  const { progressMessage, loading: progressLoading, error: progressError } = useProgressMessage();

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && isVisible && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, isVisible, isDismissed]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    // Sauvegarder dans le localStorage
    if (dismissible) {
      const dismissedKey = `dismissed_${type}_message`;
      localStorage.setItem(dismissedKey, 'true');
    }
    
    // Appeler le callback si fourni
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleRestore = () => {
    setIsDismissed(false);
    setIsVisible(true);
    
    // Supprimer du localStorage
    if (dismissible) {
      const dismissedKey = `dismissed_${type}_message`;
      localStorage.removeItem(dismissedKey);
    }
  };

  const getMessageContent = () => {
    switch (type) {
      case 'achievement':
        return {
          message: achievementMessage || "Félicitations pour votre progression !",
          loading: achievementLoading,
          error: achievementError,
          icon: Trophy,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/10",
          title: "Félicitations !"
        };
      case 'motivation':
        return {
          message: motivationQuote || "L'apprentissage est un voyage passionnant !",
          loading: motivationLoading,
          error: motivationError,
          icon: Lightbulb,
          color: "text-blue-400",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/10",
          title: "Motivation du jour"
        };
      case 'progress':
        return {
          message: progressMessage || "Continuez votre apprentissage !",
          loading: progressLoading,
          error: progressError,
          icon: TrendingUp,
          color: "text-green-400",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/10",
          title: "Votre progression"
        };
      case 'welcome':
        return {
          message: "Bienvenue dans votre espace d'apprentissage personnalisé !",
          loading: false,
          error: null,
          icon: Sparkles,
          color: "text-purple-400",
          bgColor: "bg-purple-500/5",
          borderColor: "border-purple-500/10",
          title: "Bienvenue !"
        };
      default:
        return {
          message: "",
          loading: false,
          error: null,
          icon: Sparkles,
          color: "text-gray-400",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/10",
          title: "Message"
        };
    }
  };

  const content = getMessageContent();

  // Ne pas afficher si pas de message (sauf pour le type welcome)
  if (!content.message && type !== 'welcome') {
    return null;
  }

  // Ne pas afficher si erreur (sauf pour le type welcome)
  if (content.error && type !== 'welcome') {
    return null;
  }

  // Si le message est dismissé et qu'on n'a pas de bouton de restauration, ne rien afficher
  if (isDismissed && !dismissible) {
    return null;
  }

  // Si le message est dismissé et qu'on a un bouton de restauration, afficher un bouton compact
  if (isDismissed && dismissible) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestore}
          className="w-full text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 border border-gray-700/50"
        >
          <Eye className="w-4 h-4 mr-2" />
          Afficher les messages d'encouragement
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={className}
        >
          <Card className={`${content.bgColor} ${content.borderColor} border backdrop-blur-sm relative overflow-hidden hover:bg-opacity-10 transition-all duration-200`}>
            {/* Effet de brillance subtil */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full animate-shimmer"></div>
            
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-md ${content.bgColor} flex-shrink-0`}>
                  <content.icon className={`w-4 h-4 ${content.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium text-xs ${content.color} opacity-80`}>
                      {content.title}
                    </h3>
                    
                    <div className="flex items-center gap-1">
                      {showRefresh && onRefresh && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-gray-500 hover:text-gray-300 opacity-60 hover:opacity-100"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                      )}
                      
                      {dismissible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-gray-500 hover:text-gray-300 opacity-60 hover:opacity-100"
                          onClick={handleDismiss}
                          title="Masquer ce type de message"
                        >
                          <EyeOff className="w-2.5 h-2.5" />
                        </Button>
                      )}
                      
                      {autoHide && !dismissible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-gray-500 hover:text-gray-300 opacity-60 hover:opacity-100"
                          onClick={() => setIsVisible(false)}
                        >
                          <X className="w-2.5 h-2.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {content.loading ? (
                    <div className="animate-pulse space-y-1.5">
                      <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
                      <div className="h-2.5 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-xs leading-relaxed opacity-90">
                      {content.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composants spécialisés pour chaque type de message
export function AchievementMessage({ className, ...props }: Omit<PersonalizedMessageProps, 'type'>) {
  return <PersonalizedMessage type="achievement" className={className} {...props} />;
}

export function MotivationMessage({ className, ...props }: Omit<PersonalizedMessageProps, 'type'>) {
  return <PersonalizedMessage type="motivation" className={className} dismissible={true} {...props} />;
}

export function ProgressMessage({ className, ...props }: Omit<PersonalizedMessageProps, 'type'>) {
  return <PersonalizedMessage type="progress" className={className} {...props} />;
}

export function WelcomeMessage({ className, ...props }: Omit<PersonalizedMessageProps, 'type'>) {
  return <PersonalizedMessage type="welcome" className={className} {...props} />;
} 