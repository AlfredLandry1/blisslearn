"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
} from "lucide-react";
import { useCourseStore } from "@/stores/courseStore";
import { DashboardCard } from "./DashboardCard";
import Link from "next/link";

export function ProgressOverview({ globalStats: globalStatsProp }: { globalStats?: any } = {}) {
  const { globalStats: globalStatsStore } = useCourseStore();
  const globalStats = globalStatsProp || globalStatsStore;

  const totalProgress = globalStats?.globalProgress || 0;
  const totalCourses = globalStats?.totalCourses || 0;
  const completedCourses = globalStats?.completedCourses || 0;
  const inProgressCourses = globalStats?.inProgressCourses || 0;

  return (
    <DashboardCard title="Mon parcours">
      <div className="flex flex-col sm:flex-row gap-4 md:items-center">
        <div className="flex-1">
          <div className="text-6xl font-bold text-blue-400 mb-1 truncate">
            {totalProgress}%
          </div>
          <div className="text-gray-400 text-sm truncate">
            Progression globale
          </div>
        </div>
      </div>
      <Progress value={totalProgress} className="w-full h-2 bg-gray-700" />
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4 text-left">
        <div>
          <div className="text-2xl font-bold text-white">{totalCourses}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">{inProgressCourses}</div>
          <div className="text-xs text-gray-400">En cours</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{completedCourses}</div>
          <div className="text-xs text-gray-400">Terminés</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/my-courses">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800/50 truncate"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Mes cours
          </Button>
        </Link>
        <Link href="/dashboard/certifications">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800/50 truncate"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Certifications
          </Button>
        </Link>
      </div>
    </DashboardCard>
  );
}
