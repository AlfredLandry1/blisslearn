"use client";

import { StatsCard } from "@/components/ui";
import {
  Clock,
  Target,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Calendar,
  Play,
  CheckCircle,
} from "lucide-react";
import { useCourseStore } from "@/stores/courseStore";
import { useUIStore } from "@/stores/uiStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function QuickStats() {
  const { globalStats } = useCourseStore();
  const { unreadCount } = useUIStore();

  const stats = [
    {
      title: "Cours suivis",
      value: globalStats?.totalCourses?.toString() || "0",
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      link: "/dashboard/my-courses",
      description: "Total des cours",
    },
    {
      title: "En cours",
      value: globalStats?.inProgressCourses?.toString() || "0",
      icon: <Play className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      link: "/dashboard/my-courses",
      description: "Cours actifs",
    },
    {
      title: "Terminés",
      value: globalStats?.completedCourses?.toString() || "0",
      icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      link: "/dashboard/certifications",
      description: "Cours complétés",
    },
    {
      title: "Progression",
      value: globalStats?.globalProgress
        ? `${globalStats.globalProgress}%`
        : "0%",
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      link: "/dashboard/progress",
      description: "Moyenne globale",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <Card className={`
              bg-gradient-to-br from-gray-800/60 to-gray-900/80 
              border ${stat.borderColor} rounded-xl shadow-lg 
              hover:shadow-2xl transition-all duration-300 
              backdrop-blur-md ring-1 ring-blue-500/10 relative overflow-hidden 
              group min-h-[100px] sm:min-h-[120px] cursor-pointer
            `}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col h-full">
                  {/* En-tête avec icône */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                    {stat.title === "En cours" && (globalStats?.inProgressCourses || 0) > 0 && (
                      <Badge className="bg-green-600 text-white text-xs">
                        Actif
                      </Badge>
                    )}
                    {stat.title === "Terminés" && (globalStats?.completedCourses || 0) > 0 && (
                      <Badge className="bg-purple-600 text-white text-xs">
                        Certifié
                      </Badge>
                    )}
                  </div>

                  {/* Valeur principale */}
                  <div className="flex-1">
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {stat.title}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {stat.description}
                    </div>
                  </div>
                </div>

                {/* Effet de survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                  transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Statistiques secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Favoris */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {globalStats?.favoriteCourses?.toString() || "0"}
                </div>
                <div className="text-gray-400 text-sm">Favoris</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications non lues */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <div className="w-5 h-5 text-red-400 relative">
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse" />
                  <div className="absolute inset-1 bg-gray-900 rounded-full" />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {unreadCount}
                </div>
                <div className="text-gray-400 text-sm">Notifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temps d'apprentissage */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {globalStats?.totalTimeSpent?.toString() || "0"}h
                </div>
                <div className="text-gray-400 text-sm">Apprentissage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
