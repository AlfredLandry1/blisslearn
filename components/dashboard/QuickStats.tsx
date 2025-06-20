"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend: "up" | "down";
}

const stats: StatCard[] = [
  {
    title: "Temps d'apprentissage",
    value: "24h 30min",
    change: "+12% ce mois",
    trend: "up",
    icon: Clock,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Objectifs atteints",
    value: "8/12",
    change: "+2 ce mois",
    trend: "up",
    icon: Target,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Score moyen",
    value: "87%",
    change: "+5% ce mois",
    trend: "up",
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Rang dans la classe",
    value: "#3",
    change: "+2 places",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-h-0 min-w-0">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="relative flex flex-col justify-center bg-gradient-to-br from-gray-800/70 to-gray-900/80 border border-gray-700 rounded-2xl p-4 sm:p-6 md:p-7 lg:p-9 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-md ring-1 ring-blue-500/10 min-h-[140px] group overflow-hidden hover:border-blue-500/40 w-full min-w-0 flex-1 max-w-full"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />
          <div
            className={`mb-5 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${stat.bgColor}`}
          >
            {stat.icon && <stat.icon className={`w-8 h-8 sm:w-9 sm:h-9 ${stat.color}`} />}
          </div>
          <div className="flex items-center gap-2 mb-2 min-w-0 w-full">
            <span className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg truncate w-full max-w-full break-words">
              {stat.value}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full truncate ${
                stat.trend === "up"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {stat.trend === "up" ? "▲" : "▼"} {stat.change}
            </span>
          </div>
          <div className="text-blue-200 text-base font-normal text-left drop-shadow-sm w-full truncate max-w-full break-words">
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  );
}
