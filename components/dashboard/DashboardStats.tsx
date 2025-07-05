"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  Star,
  Calendar,
  ArrowRight,
  Play,
  CheckCircle,
  Pause,
} from "lucide-react";
import { useCourseStore } from "@/stores/courseStore";
import { useUIStore } from "@/stores/uiStore";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function DashboardStats({ globalStats: globalStatsProp }: { globalStats?: any } = {}) {
  const { globalStats: globalStatsStore, courses } = useCourseStore();
  const { unreadCount } = useUIStore();
  const globalStats = globalStatsProp || globalStatsStore;

  // Calculer les statistiques détaillées
  const stats = {
    totalCourses: globalStats?.totalCourses || 0,
    inProgress: globalStats?.inProgressCourses || 0,
    completed: globalStats?.completedCourses || 0,
    favorites: globalStats?.favoriteCourses || 0,
    globalProgress: globalStats?.globalProgress || 0,
    totalHours: globalStats?.totalTimeSpent || 0,
    unreadNotifications: unreadCount,
    thisWeekProgress: Math.floor(Math.random() * 20) + 10, // Simulé
    streak: Math.floor(Math.random() * 7) + 1, // Simulé
  };

  // Cours par catégorie
  const coursesByStatus = {
    notStarted: courses?.filter(c => c.progressPercentage === 0).length || 0,
    inProgress: courses?.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100).length || 0,
    completed: courses?.filter(c => c.progressPercentage === 100).length || 0,
  };

  // Objectifs de la semaine
  const weeklyGoals = [
    {
      title: "Cours à terminer",
      current: stats.completed,
      target: stats.completed + 2,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Heures d'apprentissage",
      current: stats.totalHours,
      target: stats.totalHours + 5,
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Nouveaux cours",
      current: stats.inProgress,
      target: stats.inProgress + 1,
      icon: BookOpen,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progression globale */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <Badge className="bg-blue-600 text-white text-xs">
                {stats.globalProgress}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.globalProgress}%
            </div>
            <div className="text-gray-400 text-sm mb-3">Progression globale</div>
            <Progress value={stats.globalProgress} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        {/* Cours en cours */}
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Play className="w-5 h-5 text-green-400" />
              </div>
              <Badge className="bg-green-600 text-white text-xs">
                Actif
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.inProgress}
            </div>
            <div className="text-gray-400 text-sm">Cours en cours</div>
          </CardContent>
        </Card>

        {/* Cours terminés */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <Badge className="bg-purple-600 text-white text-xs">
                Certifié
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.completed}
            </div>
            <div className="text-gray-400 text-sm">Cours terminés</div>
          </CardContent>
        </Card>

        {/* Streak d'apprentissage */}
        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <Badge className="bg-orange-600 text-white text-xs">
                {stats.streak}j
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.streak}
            </div>
            <div className="text-gray-400 text-sm">Jours consécutifs</div>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs de la semaine */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Objectifs de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyGoals.map((goal, index) => {
              const IconComponent = goal.icon;
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${goal.bgColor}`}>
                        <IconComponent className={`w-4 h-4 ${goal.color}`} />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {goal.title}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {goal.current} / {goal.target}
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-xs ${
                      progress >= 100 ? 'bg-green-600 text-white' :
                      progress >= 75 ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-2 ${
                      progress >= 100 ? 'bg-green-700' :
                      progress >= 75 ? 'bg-yellow-700' :
                      'bg-gray-700'
                    }`} 
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Répartition des cours */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Répartition des cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-800/40 border border-gray-700/30">
              <div className="text-2xl font-bold text-gray-400 mb-1">
                {coursesByStatus.notStarted}
              </div>
              <div className="text-gray-500 text-sm">Non commencés</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {coursesByStatus.inProgress}
              </div>
              <div className="text-blue-300 text-sm">En cours</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {coursesByStatus.completed}
              </div>
              <div className="text-green-300 text-sm">Terminés</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/progress">
          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Voir la progression détaillée
          </Button>
        </Link>
        
        <Link href="/dashboard/my-courses">
          <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/20">
            <BookOpen className="w-4 h-4 mr-2" />
            Mes cours
          </Button>
        </Link>
        
        <Link href="/dashboard/certifications">
          <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/20">
            <Award className="w-4 h-4 mr-2" />
            Certifications
          </Button>
        </Link>
      </div>
    </div>
  );
} 