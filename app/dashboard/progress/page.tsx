"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  BookOpen,
  Star,
  BarChart3,
  Activity,
  Trophy,
  Zap,
  Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useUIStore } from "@/stores/uiStore";
import { PageLoadingState } from "@/components/ui/loading-states";

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
  totalTimeSpent: number;
  favoriteCourses: number;
  completionRate: number;
  streakDays: number;
  weeklyProgress: number;
  monthlyProgress: number;
  topPlatforms: Array<{platform: string, count: number}>;
  recentActivity: Array<{courseTitle: string, action: string, date: string}>;
}

export default function ProgressAnalyticsPage() {
  const { data: session, status: authStatus } = useSession();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const { setLoading: setGlobalLoading, clearLoading, addNotification } = useUIStore();
  const loadingKey = "progress-analytics";

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    
    setGlobalLoading(loadingKey, true);
    fetch(`/api/courses/progress/stats?timeRange=${timeRange}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setGlobalLoading(loadingKey, false);
        setLoading(false);
      })
      .catch(() => {
        addNotification({
          id: `progress-error-${Date.now()}`,
          type: "error",
          title: "Erreur",
          message: "Impossible de charger les statistiques",
          duration: 5000
        });
        setGlobalLoading(loadingKey, false);
        setLoading(false);
      });
  }, [authStatus, timeRange, setGlobalLoading, clearLoading, addNotification, loadingKey]);

  if (authStatus === "loading" || loading) {
    return (
      <DashboardLayout>
        <PageLoadingState message="Chargement des statistiques..." />
      </DashboardLayout>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-20">
          Veuillez vous connecter pour voir vos statistiques de progression.
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-20">
          Aucune donnée de progression disponible.
        </div>
      </DashboardLayout>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics de Progression</h1>
            <p className="text-gray-400">Suivez vos performances et votre évolution d'apprentissage</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Semaine
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Mois
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Année
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Cours terminés</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedCourses}</div>
              <p className="text-xs text-gray-400">
                sur {stats.totalCourses} cours suivis
              </p>
              <Progress value={stats.completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Progression moyenne</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.averageProgress}%</div>
              <p className="text-xs text-gray-400">
                {stats.inProgressCourses} cours en cours
              </p>
              <Progress value={stats.averageProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Temps total</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatTime(stats.totalTimeSpent)}</div>
              <p className="text-xs text-gray-400">
                temps passé à apprendre
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Série active</CardTitle>
              <Zap className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.streakDays}</div>
              <p className="text-xs text-gray-400">
                jours consécutifs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progression hebdomadaire/mensuelle */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Progression {timeRange === 'week' ? 'hebdomadaire' : timeRange === 'month' ? 'mensuelle' : 'annuelle'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Cette {timeRange === 'week' ? 'semaine' : timeRange === 'month' ? 'mois' : 'année'}</span>
                  <Badge className="bg-green-900/20 text-green-300 border-green-600">
                    +{timeRange === 'week' ? stats.weeklyProgress : stats.monthlyProgress}%
                  </Badge>
                </div>
                <Progress 
                  value={timeRange === 'week' ? stats.weeklyProgress : stats.monthlyProgress} 
                  className="h-3" 
                />
                <p className="text-xs text-gray-400">
                  Progression par rapport à la période précédente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plateformes préférées */}
          <Card className="bg-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Plateformes préférées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPlatforms.map((platform, index) => (
                  <div key={platform.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(platform.count / stats.totalCourses) * 100} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm text-gray-400 w-8 text-right">
                        {platform.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente */}
        <Card className="bg-gray-900/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-white font-medium">{activity.courseTitle}</p>
                      <p className="text-xs text-gray-400">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 