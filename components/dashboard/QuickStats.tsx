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
} from "lucide-react";
import { useCourseStore } from "@/stores/courseStore";

export function QuickStats() {
  const { globalStats } = useCourseStore();

  const stats = [
    {
      title: "Cours suivis",
      value: globalStats?.totalCourses?.toString() || "0",
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      color: "text-blue-400",
    },
    {
      title: "En cours",
      value: globalStats?.inProgressCourses?.toString() || "0",
      icon: <Target className="w-8 h-8 text-green-400" />,
      color: "text-green-400",
    },
    {
      title: "Favoris",
      value: globalStats?.favoriteCourses?.toString() || "0",
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      color: "text-yellow-400",
    },
    {
      title: "Progression",
      value: globalStats?.globalProgress
        ? `${globalStats.globalProgress}%`
        : "0%",
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, i) => (
        <StatsCard
          key={i}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-md ring-1 ring-blue-500/10 relative overflow-hidden group min-h-[140px]"
        />
      ))}
    </div>
  );
}
