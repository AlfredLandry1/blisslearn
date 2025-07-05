"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Target,
  BookOpen,
  Play,
  Clock,
  TrendingUp,
  Star,
  Lightbulb,
  ArrowRight,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useCourseStore } from "@/stores/courseStore";
import { useUIStore } from "@/stores/uiStore";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useMotivationContent, useNextStepSuggestion } from "@/hooks/usePersonalizedContent";

export function DailySummary() {
  const { courses, globalStats } = useCourseStore();
  const { unreadCount } = useUIStore();
  const { data: session } = useSession();
  
  // Utilisation des hooks IA personnalisés
  const { motivationQuote, dailyGoal, loading: motivationLoading } = useMotivationContent();
  const { nextStepSuggestion, loading: suggestionLoading } = useNextStepSuggestion();

  const today = new Date();
  const todayFormatted = format(today, 'EEEE d MMMM', { locale: fr });
  const timeOfDay = today.getHours();
  
  const getGreeting = () => {
    if (timeOfDay < 12) return "Bonjour";
    if (timeOfDay < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // Suggestions personnalisées
  const getSuggestions = () => {
    const suggestions = [];

    // Cours à continuer
    const inProgressCourses = courses?.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100) || [];
    if (inProgressCourses.length > 0) {
      const nextCourse = inProgressCourses[0];
      suggestions.push({
        type: "continue",
        title: "Continuer votre apprentissage",
        description: `Reprenez "${nextCourse.title}" (${nextCourse.progressPercentage}% terminé)`,
        icon: Play,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        link: `/dashboard/my-courses/${nextCourse.id}`,
        priority: "high",
      });
    }

    // Nouveaux cours à découvrir
    if (courses && courses.length < 5) {
      suggestions.push({
        type: "discover",
        title: "Découvrir de nouveaux cours",
        description: "Explorez notre catalogue et trouvez votre prochain défi",
        icon: BookOpen,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        link: "/dashboard/explorer",
        priority: "medium",
      });
    }

    // Objectifs de progression
    if (globalStats && globalStats.globalProgress < 100) {
      const nextMilestone = Math.ceil(globalStats.globalProgress / 25) * 25;
      suggestions.push({
        type: "milestone",
        title: "Atteindre un objectif",
        description: `Visez ${nextMilestone}% de progression globale (actuellement ${globalStats.globalProgress}%)`,
        icon: Target,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        link: "/dashboard/progress",
        priority: "medium",
      });
    }

    // Notifications à consulter
    if (unreadCount > 0) {
      suggestions.push({
        type: "notifications",
        title: "Consulter vos notifications",
        description: `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`,
        icon: Star,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        link: "/dashboard/notifications",
        priority: "high",
      });
    }

    // Certifications à obtenir
    const nearCompletionCourses = courses?.filter(c => c.progressPercentage >= 80 && c.progressPercentage < 100) || [];
    if (nearCompletionCourses.length > 0) {
      const course = nearCompletionCourses[0];
      suggestions.push({
        type: "certification",
        title: "Obtenir une certification",
        description: `Terminez "${course.title}" pour obtenir votre certification`,
        icon: CheckCircle,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        link: `/dashboard/my-courses/${course.id}`,
        priority: "high",
      });
    }

    return suggestions.slice(0, 3); // Limiter à 3 suggestions
  };

  const suggestions = getSuggestions();

  // Statistiques du jour
  const dailyStats = {
    timeSpent: Math.floor(Math.random() * 2) + 1, // Simulé
    lessonsCompleted: Math.floor(Math.random() * 3) + 1, // Simulé
    streak: Math.floor(Math.random() * 7) + 1, // Simulé
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2 mb-1">
              <Sun className="w-5 h-5 text-yellow-400" />
              Résumé de la journée
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              {todayFormatted} • {getGreeting()}
            </p>
          </div>
          <Badge className="bg-blue-600 text-white">
            {format(today, 'dd/MM', { locale: fr })}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Section motivation personnalisée */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              {motivationLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <p className="text-white font-medium mb-1">
                    {motivationQuote}
                  </p>
                  <p className="text-blue-300 text-sm">
                    {dailyGoal}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques du jour */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-white font-semibold text-lg">{dailyStats.timeSpent}h</p>
            <p className="text-gray-400 text-xs">Temps passé</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-white font-semibold text-lg">{dailyStats.lessonsCompleted}</p>
            <p className="text-gray-400 text-xs">Leçons terminées</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-white font-semibold text-lg">{dailyStats.streak}</p>
            <p className="text-gray-400 text-xs">Jours de suite</p>
          </div>
        </div>

        {/* Prochaine étape suggérée */}
        {!suggestionLoading && nextStepSuggestion && (
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium mb-1">Prochaine étape suggérée</p>
                <p className="text-green-300 text-sm">{nextStepSuggestion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions d'actions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Actions recommandées</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Link key={index} href={suggestion.link}>
                  <div className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${suggestion.bgColor} border-gray-600/50 hover:border-gray-500/70`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${suggestion.bgColor}`}>
                        <suggestion.icon className={`w-4 h-4 ${suggestion.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {suggestion.title}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {suggestion.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 