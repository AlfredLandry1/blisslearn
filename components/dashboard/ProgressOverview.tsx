"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Course {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  estimatedTime: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction à React",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    category: "Développement Web",
    estimatedTime: "2h 30min restantes",
  },
  {
    id: "2",
    title: "TypeScript Avancé",
    progress: 45,
    totalLessons: 8,
    completedLessons: 4,
    category: "Développement Web",
    estimatedTime: "4h 15min restantes",
  },
  {
    id: "3",
    title: "Next.js 14",
    progress: 20,
    totalLessons: 15,
    completedLessons: 3,
    category: "Framework",
    estimatedTime: "8h restantes",
  },
];

export function ProgressOverview() {
  const totalProgress =
    mockCourses.reduce((acc, course) => acc + course.progress, 0) /
    mockCourses.length;
  const totalCourses = mockCourses.length;
  const completedCourses = mockCourses.filter(
    (course) => course.progress === 100
  ).length;

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 border
     border-gray-700 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] 
     transition-all duration-300 backdrop-blur-md ring-1 ring-blue-500/10 relative overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-60
       transition-opacity duration-300 pointer-events-none" />
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg font-bold truncate">
          Mon parcours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 md:items-center-safe">
          <div className="flex-1">
            <div className="text-4xl font-bold text-blue-400 mb-1 truncate">
              75%
            </div>
            <div className="text-gray-400 text-sm truncate">
              Progression globale
            </div>
          </div>
          <Progress value={75} className="w-full sm:w-48 h-2 bg-gray-700" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800/50 truncate"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Voir les statistiques
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800/50 truncate"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Certifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
