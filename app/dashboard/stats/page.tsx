"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionCard } from "@/components/dashboard/PredictionCard";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  BookOpen,
  Trophy,
  Users,
  Calendar
} from "lucide-react";

interface StatMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const monthlyData = [
  { month: "Jan", hours: 45, courses: 3, certificates: 1 },
  { month: "Fév", hours: 52, courses: 4, certificates: 2 },
  { month: "Mar", hours: 38, courses: 2, certificates: 1 },
  { month: "Avr", hours: 61, courses: 5, certificates: 3 },
  { month: "Mai", hours: 48, courses: 3, certificates: 2 },
  { month: "Juin", hours: 55, courses: 4, certificates: 2 }
];

const categoryData = [
  { category: "Développement Web", hours: 120, percentage: 40 },
  { category: "Framework", hours: 90, percentage: 30 },
  { category: "Base de données", hours: 45, percentage: 15 },
  { category: "Backend", hours: 45, percentage: 15 }
];

export default function StatsPage() {
  const metrics: StatMetric[] = [
    {
      label: "Temps total d'apprentissage",
      value: "295h",
      change: "+12% ce mois",
      trend: "up",
      icon: Clock,
      color: "text-blue-400"
    },
    {
      label: "Cours terminés",
      value: "21",
      change: "+3 ce mois",
      trend: "up",
      icon: BookOpen,
      color: "text-green-400"
    },
    {
      label: "Certifications obtenues",
      value: "8",
      change: "+2 ce mois",
      trend: "up",
      icon: Trophy,
      color: "text-yellow-400"
    },
    {
      label: "Score moyen",
      value: "87%",
      change: "+5% ce mois",
      trend: "up",
      icon: Target,
      color: "text-purple-400"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Statistiques
          </h1>
          <p className="text-gray-400">
            Analysez vos performances et votre progression
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden">
              <CardContent className="p-4 overflow-hidden">
                <div className="flex items-center justify-between min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-sm truncate">{metric.label}</p>
                    <p className="text-2xl font-bold text-white mt-1 truncate">{metric.value}</p>
                    <p className={`text-xs mt-1 truncate ${
                      metric.trend === "up" ? "text-green-400" : 
                      metric.trend === "down" ? "text-red-400" : "text-gray-400"
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-800/50 flex-shrink-0`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution mensuelle */}
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden">
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-white flex items-center truncate">
                <TrendingUp className="w-5 h-5 mr-2 flex-shrink-0" />
                Évolution mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-end justify-between h-32">
                  {monthlyData.map((month, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="flex flex-col items-center space-y-1">
                        <div 
                          className="w-8 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                          style={{ height: `${(month.hours / 70) * 100}%` }}
                        />
                        <div 
                          className="w-6 bg-gradient-to-t from-green-500 to-blue-600 rounded-t"
                          style={{ height: `${(month.courses / 6) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs truncate">{month.month}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-t from-blue-500 to-purple-600 rounded mr-1 flex-shrink-0"></div>
                    <span className="text-gray-400 truncate">Heures</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-t from-green-500 to-blue-600 rounded mr-1 flex-shrink-0"></div>
                    <span className="text-gray-400 truncate">Cours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par catégorie */}
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden">
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-white flex items-center truncate">
                <BarChart3 className="w-5 h-5 mr-2 flex-shrink-0" />
                Répartition par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="text-white text-sm truncate flex-1">{category.category}</span>
                      <span className="text-gray-400 text-sm flex-shrink-0">{category.hours}h</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte de prédictions d'évolution */}
        <div className="w-full">
          <PredictionCard />
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activité quotidienne */}
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden">
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-white truncate">Activité quotidienne</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="space-y-3">
                {[
                  { day: "Lundi", hours: 2.5, streak: true },
                  { day: "Mardi", hours: 3.2, streak: true },
                  { day: "Mercredi", hours: 1.8, streak: true },
                  { day: "Jeudi", hours: 4.1, streak: true },
                  { day: "Vendredi", hours: 2.9, streak: true },
                  { day: "Samedi", hours: 5.2, streak: true },
                  { day: "Dimanche", hours: 3.7, streak: true }
                ].map((day, index) => (
                  <div key={index} className="flex items-center justify-between min-w-0">
                    <span className="text-gray-300 text-sm truncate flex-1">{day.day}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-white text-sm">{day.hours}h</span>
                      {day.streak && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objectifs */}
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden">
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-white truncate">Objectifs du mois</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="space-y-4">
                {[
                  { goal: "Temps d'apprentissage", current: 45, target: 50, unit: "h" },
                  { goal: "Cours terminés", current: 3, target: 5, unit: "" },
                  { goal: "Certifications", current: 1, target: 2, unit: "" },
                  { goal: "Score moyen", current: 87, target: 90, unit: "%" }
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="text-gray-300 text-sm truncate flex-1">{goal.goal}</span>
                      <span className="text-white text-sm flex-shrink-0">
                        {goal.current}/{goal.target}{goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Classement */}
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden">
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-white truncate">Classement</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Marie D.", score: 95, isYou: false },
                  { rank: 2, name: "Pierre L.", score: 92, isYou: false },
                  { rank: 3, name: "Vous", score: 87, isYou: true },
                  { rank: 4, name: "Sophie M.", score: 84, isYou: false },
                  { rank: 5, name: "Thomas R.", score: 81, isYou: false }
                ].map((user, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded min-w-0 ${
                    user.isYou ? 'bg-blue-500/20 border border-blue-500/30' : ''
                  }`}>
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <span className={`text-sm font-medium flex-shrink-0 ${
                        user.rank === 1 ? 'text-yellow-400' :
                        user.rank === 2 ? 'text-gray-300' :
                        user.rank === 3 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        #{user.rank}
                      </span>
                      <span className={`text-sm truncate ${
                        user.isYou ? 'text-blue-400 font-medium' : 'text-white'
                      }`}>
                        {user.name}
                      </span>
                    </div>
                    <span className="text-white text-sm flex-shrink-0">{user.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 