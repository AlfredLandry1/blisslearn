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
import { AchievementMessage, MotivationMessage, ProgressMessage } from "@/components/ui/personalized-message";
import { usePersonalizedContent } from "@/hooks/usePersonalizedContent";

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
  // Hook pour rafraîchir le contenu personnalisé
  const { refresh: refreshPersonalizedContent } = usePersonalizedContent();

  const metrics: StatMetric[] = [
    {
      label: "Progression globale",
      value: "78%",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      label: "Temps d'apprentissage",
      value: "24h",
      change: "+3h",
      trend: "up",
      icon: Clock,
      color: "text-blue-400"
    },
    {
      label: "Cours terminés",
      value: "12",
      change: "+2",
      trend: "up",
      icon: BookOpen,
      color: "text-purple-400"
    },
    {
      label: "Certifications",
      value: "5",
      change: "+1",
      trend: "up",
      icon: Trophy,
      color: "text-yellow-400"
    }
  ];

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Statistiques Détaillées</h1>
            <p className="text-gray-400">Analyse approfondie de vos performances d'apprentissage</p>
          </div>
        </div>

        {/* Messages personnalisés IA */}
        <div className="space-y-4 mb-8">
          <AchievementMessage 
            autoHide={true} 
            autoHideDelay={8000}
            className="opacity-0 animate-fade-in duration-500"
          />
          <MotivationMessage 
            showRefresh={true}
            onRefresh={refreshPersonalizedContent}
            className="opacity-0 animate-fade-in duration-500 delay-200"
          />
          <ProgressMessage 
            className="opacity-0 animate-fade-in duration-500 delay-400"
          />
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-gray-900/60 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-800/50`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <Badge className={`${getTrendColor(metric.trend)} bg-gray-800/50 border-gray-600`}>
                    {getTrendIcon(metric.trend)} {metric.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-gray-400 text-sm">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Prédictions IA */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Prédictions d'évolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PredictionCard />
            </CardContent>
          </Card>

          {/* Analyse des tendances */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Tendances d'apprentissage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Progression constante</span>
                  </div>
                  <Badge className="bg-green-900/20 text-green-300 border-green-600">
                    +15%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Temps d'étude régulier</span>
                  </div>
                  <Badge className="bg-blue-900/20 text-blue-300 border-blue-600">
                    Stable
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Nouveaux domaines</span>
                  </div>
                  <Badge className="bg-purple-900/20 text-purple-300 border-purple-600">
                    +3
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques avancées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Répartition par plateforme */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                Plateformes préférées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Coursera</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Udemy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">edX</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objectifs hebdomadaires */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Objectifs de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Heures d'étude</span>
                    <span className="text-sm text-gray-400">8/10h</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Cours à terminer</span>
                    <span className="text-sm text-gray-400">2/3</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Nouveaux concepts</span>
                    <span className="text-sm text-gray-400">5/7</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-gray-800/40 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-xs text-white">Machine Learning terminé</p>
                    <p className="text-xs text-gray-400">Il y a 2h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-800/40 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-xs text-white">React.js commencé</p>
                    <p className="text-xs text-gray-400">Il y a 1j</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-800/40 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-xs text-white">Certification obtenue</p>
                    <p className="text-xs text-gray-400">Il y a 3j</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 