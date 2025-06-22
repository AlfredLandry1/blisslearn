"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Star, 
  Clock, 
  ExternalLink,
  ArrowRight,
  Lightbulb,
  Zap
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useUIStore } from "@/stores/uiStore";
import { ProgressTracker } from "./ProgressTracker";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  platform: string;
  level: string;
  rating: number;
  url: string;
  reason: string;
  score: number;
  skills?: string;
  duration?: string;
  price?: string;
}

interface RecommendationsData {
  recommendations: Recommendation[];
  preferences: {
    platforms: Record<string, number>;
    levels: Record<string, number>;
    averageProgress: number;
    completionRate: number;
  };
  totalFound: number;
}

interface CourseRecommendationsProps {
  type?: 'all' | 'similar' | 'next-level' | 'trending';
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export function CourseRecommendations({ 
  type = 'all', 
  limit = 6, 
  showTitle = true,
  className = ""
}: CourseRecommendationsProps) {
  const { data: session, status: authStatus } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Recommendation | null>(null);

  const { setLoading: setGlobalLoading, clearLoading, addNotification } = useUIStore();
  const loadingKey = `recommendations-${type}`;

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    
    setGlobalLoading(loadingKey, true);
    fetch(`/api/courses/recommendations?type=${type}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
        setGlobalLoading(loadingKey, false);
        setLoading(false);
      })
      .catch(() => {
        addNotification({
          id: `recommendations-error-${Date.now()}`,
          type: "error",
          title: "Erreur",
          message: "Impossible de charger les recommandations",
          duration: 5000
        });
        setGlobalLoading(loadingKey, false);
        setLoading(false);
      });
  }, [authStatus, type, limit, setGlobalLoading, clearLoading, addNotification, loadingKey]);

  const handleStartCourse = async (course: Recommendation) => {
    try {
      const response = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          status: 'in_progress',
          progressPercentage: 0
        })
      });

      if (response.ok) {
        addNotification({
          id: `course-started-${Date.now()}`,
          type: "success",
          title: "Cours ajouté !",
          message: `"${course.title}" a été ajouté à vos cours en cours`,
          duration: 3000
        });
      }
    } catch (error) {
      addNotification({
        id: `course-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible d'ajouter le cours",
        duration: 5000
      });
    }
  };

  const getReasonIcon = (reason: string) => {
    if (reason.includes("Similaire")) return <Sparkles className="w-4 h-4" />;
    if (reason.includes("Niveau suivant")) return <Target className="w-4 h-4" />;
    if (reason.includes("populaire")) return <TrendingUp className="w-4 h-4" />;
    return <Lightbulb className="w-4 h-4" />;
  };

  const getReasonColor = (reason: string) => {
    if (reason.includes("Similaire")) return "text-blue-400 bg-blue-900/20 border-blue-600";
    if (reason.includes("Niveau suivant")) return "text-green-400 bg-green-900/20 border-green-600";
    if (reason.includes("populaire")) return "text-orange-400 bg-orange-900/20 border-orange-600";
    return "text-purple-400 bg-purple-900/20 border-purple-600";
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-800 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return null;
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">Aucune recommandation</h3>
        <p className="text-gray-400">
          Commencez par suivre quelques cours pour recevoir des recommandations personnalisées.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            Recommandations pour vous
          </h2>
          <p className="text-gray-400">
            Basé sur votre progression et vos préférences
          </p>
        </div>
      )}

      {/* Statistiques rapides */}
      {recommendations.preferences && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {Math.round(recommendations.preferences.averageProgress)}%
              </div>
              <p className="text-xs text-gray-400">Progression moyenne</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {Math.round(recommendations.preferences.completionRate * 100)}%
              </div>
              <p className="text-xs text-gray-400">Taux de complétion</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {Object.keys(recommendations.preferences.platforms).length}
              </div>
              <p className="text-xs text-gray-400">Plateformes utilisées</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {recommendations.totalFound}
              </div>
              <p className="text-xs text-gray-400">Cours recommandés</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grille de recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.recommendations.map((course) => (
          <Card key={course.id} className="bg-gray-900 border border-gray-800 rounded-2xl hover:shadow-xl transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-blue-900/40 text-blue-300 border-blue-500/30 text-xs">
                      {course.platform}
                    </Badge>
                    {course.level && (
                      <Badge className="bg-gray-800 text-gray-300 text-xs">
                        {course.level}
                      </Badge>
                    )}
                  </div>
                </div>
                {course.rating && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400 line-clamp-2">
                {course.description}
              </p>

              {/* Raison de la recommandation */}
              <div className="flex items-center gap-2">
                {getReasonIcon(course.reason)}
                <Badge className={`text-xs ${getReasonColor(course.reason)}`}>
                  {course.reason}
                </Badge>
              </div>

              {/* Score de pertinence */}
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Pertinence</span>
                    <span>{Math.round(course.score)}%</span>
                  </div>
                  <Progress value={course.score} className="h-2" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStartCourse(course)}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Commencer
                </Button>
                {course.url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => window.open(course.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de détail si un cours est sélectionné */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{selectedCourse.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCourse(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProgressTracker
                courseId={selectedCourse.id}
                courseTitle={selectedCourse.title}
                courseUrl={selectedCourse.url}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 