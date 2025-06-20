"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  BarChart3
} from "lucide-react";

interface ProgressData {
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  timeSpent: string;
  lastActivity: string;
}

const mockProgressData: ProgressData[] = [
  {
    category: "Développement Web",
    progress: 78,
    totalLessons: 45,
    completedLessons: 35,
    timeSpent: "18h 30min",
    lastActivity: "Il y a 2 heures"
  },
  {
    category: "Framework",
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    timeSpent: "8h 15min",
    lastActivity: "Il y a 1 jour"
  },
  {
    category: "Base de données",
    progress: 100,
    totalLessons: 25,
    completedLessons: 25,
    timeSpent: "6h 45min",
    lastActivity: "Il y a 3 jours"
  },
  {
    category: "Backend",
    progress: 0,
    totalLessons: 38,
    completedLessons: 0,
    timeSpent: "0h",
    lastActivity: "Jamais"
  }
];

const weeklyData = [
  { day: "Lun", hours: 2.5 },
  { day: "Mar", hours: 3.2 },
  { day: "Mer", hours: 1.8 },
  { day: "Jeu", hours: 4.1 },
  { day: "Ven", hours: 2.9 },
  { day: "Sam", hours: 5.2 },
  { day: "Dim", hours: 3.7 }
];

export default function ProgressPage() {
  const totalProgress = mockProgressData.reduce((acc, item) => acc + item.progress, 0) / mockProgressData.length;
  const totalTimeSpent = mockProgressData.reduce((acc, item) => {
    const hours = parseFloat(item.timeSpent.split('h')[0]);
    return acc + hours;
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Mon parcours
          </h1>
          <p className="text-gray-400">
            Suivez votre progression et vos objectifs d'apprentissage
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm">Progression globale</p>
                  <p className="text-2xl font-bold text-white">{totalProgress.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm">Temps total</p>
                  <p className="text-2xl font-bold text-white">{totalTimeSpent}h</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm">Leçons terminées</p>
                  <p className="text-2xl font-bold text-white">74</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm">Objectifs atteints</p>
                  <p className="text-2xl font-bold text-white">8/12</p>
                </div>
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progression par catégorie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Progression par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockProgressData.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{item.category}</h4>
                      <p className="text-gray-400 text-sm">
                        {item.completedLessons}/{item.totalLessons} leçons
                      </p>
                    </div>
                    <Badge variant="outline" className="text-gray-300">
                      {item.progress}%
                    </Badge>
                  </div>
                  
                  <Progress value={item.progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Temps: {item.timeSpent}</span>
                    <span>Dernière activité: {item.lastActivity}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activité hebdomadaire */}
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Activité hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between h-32">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-8 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                        style={{ height: `${(day.hours / 6) * 100}%` }}
                      />
                      <span className="text-gray-400 text-xs">{day.day}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Temps moyen par jour</span>
                  <span className="text-white font-medium">
                    {weeklyData.reduce((acc, day) => acc + day.hours, 0) / 7} heures
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectifs et récompenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Objectifs du mois
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Terminer 5 cours", progress: 80, completed: 4, total: 5 },
                { title: "Passer 20h à apprendre", progress: 65, completed: 13, total: 20 },
                { title: "Obtenir 3 certifications", progress: 33, completed: 1, total: 3 },
                { title: "Participer à 2 webinars", progress: 50, completed: 1, total: 2 }
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{goal.title}</span>
                    <span className="text-gray-400 text-sm">{goal.completed}/{goal.total}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Récompenses récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Premier cours terminé", description: "Vous avez terminé votre premier cours", date: "Il y a 2 jours" },
                { title: "Apprenant assidu", description: "7 jours consécutifs d'apprentissage", date: "Il y a 1 semaine" },
                { title: "Certification TypeScript", description: "Vous avez obtenu la certification", date: "Il y a 2 semaines" }
              ].map((reward, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium text-sm">{reward.title}</h4>
                    <p className="text-gray-400 text-xs">{reward.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{reward.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 