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

export function DailySummary() {
  const { courses, globalStats } = useCourseStore();
  const { unreadCount } = useUIStore();

  const today = new Date();
  const todayFormatted = format(today, 'EEEE d MMMM', { locale: fr });
  const timeOfDay = today.getHours();
  
  const getGreeting = () => {
    if (timeOfDay < 12) return "Bonjour";
    if (timeOfDay < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Chaque petit pas compte vers votre objectif !",
      "L'apprentissage est un voyage, pas une destination.",
      "Vous progressez chaque jour, continuez !",
      "La persévérance est la clé du succès.",
      "Votre avenir se construit aujourd'hui.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
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
        {/* Message motivant */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">
                💡 Inspiration du jour
              </p>
              <p className="text-gray-300 text-sm">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques du jour */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {dailyStats.timeSpent}h
            </div>
            <div className="text-gray-400 text-xs">Temps d'apprentissage</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {dailyStats.lessonsCompleted}
            </div>
            <div className="text-gray-400 text-xs">Leçons terminées</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {dailyStats.streak}j
            </div>
            <div className="text-gray-400 text-xs">Série en cours</div>
          </div>
        </div>

        {/* Suggestions personnalisées */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            Suggestions pour aujourd'hui
          </h4>
          
          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <div className="text-center py-6">
                <BookOpen className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Aucune suggestion pour le moment</p>
              </div>
            ) : (
              suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                const isHighPriority = suggestion.priority === "high";
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-200 hover:border-gray-600/50 group ${
                      isHighPriority 
                        ? 'bg-red-500/5 border-red-500/30' 
                        : 'bg-gray-800/40 border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${suggestion.bgColor}`}>
                        <IconComponent className={`w-4 h-4 ${suggestion.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className={`text-sm font-medium truncate ${
                          isHighPriority ? 'text-red-300' : 'text-white'
                        }`}>
                          {suggestion.title}
                        </h5>
                        <p className="text-gray-400 text-xs truncate">
                          {suggestion.description}
                        </p>
                      </div>
                      
                      <Link href={suggestion.link}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action rapide */}
        <div className="pt-4 border-t border-gray-700/50">
          <Link href="/dashboard/explorer">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Découvrir de nouveaux cours
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 