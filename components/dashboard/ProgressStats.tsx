"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Target,
  Award,
  Calendar
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { StatsCard, ProgressBarWithLabel, SectionHeader } from "@/components/ui";

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number;
  averageRating: number;
  completionRate: number;
  recentActivity: {
    courseTitle: string;
    status: string;
    lastActivityAt: string;
  }[];
}

export function ProgressStats() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  const { setLoading: setGlobalLoading, clearLoading, addNotification } = useUIStore();
  const loadingKey = "progress-stats";

  useEffect(() => {
    const fetchStats = async () => {
      setGlobalLoading(loadingKey, true);
      try {
        const response = await fetch("/api/courses/progress/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        addNotification({
          id: `stats-error-${Date.now()}`,
          type: "error",
          title: "Erreur",
          message: "Impossible de charger les statistiques",
          duration: 5000
        });
      } finally {
        setGlobalLoading(loadingKey, false);
        setLoading(false);
      }
    };

    fetchStats();
  }, [setGlobalLoading, clearLoading, addNotification, loadingKey]);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-900/60 border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "paused": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Terminé";
      case "in_progress": return "En cours";
      case "paused": return "En pause";
      default: return "Non commencé";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Cours suivis"
          value={stats.totalCourses}
          icon={<BookOpen className="w-8 h-8 text-blue-400" />}
        />
        <StatsCard
          title="Terminés"
          value={stats.completedCourses}
          icon={<CheckCircle className="w-8 h-8 text-green-400" />}
        />
        <StatsCard
          title="Temps total"
          value={formatTime(stats.totalTimeSpent)}
          icon={<Clock className="w-8 h-8 text-yellow-400" />}
        />
        <StatsCard
          title="Note moyenne"
          value={`${stats.averageRating.toFixed(1)}/5`}
          icon={<Award className="w-8 h-8 text-purple-400" />}
        />
      </div>

      {/* Progression globale */}
      <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
        <SectionHeader icon={<TrendingUp className="w-5 h-5" />}>Progression globale</SectionHeader>
        <div className="p-6 space-y-4">
          <ProgressBarWithLabel value={stats.completionRate} label="Taux de complétion" />
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{stats.inProgressCourses} en cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{stats.completedCourses} terminés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      {stats.recentActivity.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
          <SectionHeader icon={<Calendar className="w-5 h-5" />}>Activité récente</SectionHeader>
          <div className="p-6 space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="font-medium text-white">{activity.courseTitle}</span>
                <span className="text-xs px-2 py-1 rounded-full " style={{ background: getStatusColor(activity.status) }}>{getStatusLabel(activity.status)}</span>
                <span className="text-xs text-gray-400">{activity.lastActivityAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 