"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Star, 
  Target, 
  ExternalLink, 
  Zap, 
  TrendingUp, 
  Clock, 
  Users
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { ProgressTracker } from "./ProgressTracker";
import { CourseCard } from "./CourseCard";
import { useApiClient } from "@/hooks/useApiClient";
import { useRecommendationMessage } from "@/hooks/usePersonalizedContent";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  platform: string;
  level_normalized?: string;
  rating_numeric?: number;
  link?: string;
  reason: string;
  score: number;
}

interface RecommendationsData {
  recommendations: Recommendation[];
  stats: {
    totalCourses: number;
    completedCourses: number;
    averageScore: number;
    topPlatform: string;
  };
}

interface CourseRecommendationsProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
  courses?: any[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export function CourseRecommendations({ 
  limit = 6, 
  showTitle = true,
  className = "",
  courses = [],
  title: propTitle = "Cours recommandés",
  subtitle: propSubtitle = "Découvrez nos meilleures formations",
  isLoading = false
}: CourseRecommendationsProps) {
  const { data: session, status: authStatus } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Utilisation du hook IA personnalisé
  const { recommendationMessage, loading: recommendationLoading } = useRecommendationMessage();

  const { addNotification, setLoading, isKeyLoading, createPersistentNotification } = useUIStore();
  const loadingKey = "course-recommendations";
  const loading = isKeyLoading(loadingKey);

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
    get: fetchRecommendations,
    post: updateProgress
  } = useApiClient<RecommendationsData>({
    onSuccess: (data) => {
      setRecommendations(data);
      setLoading(loadingKey, false);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(loadingKey, false);
      createPersistentNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les recommandations'
      });
    }
  });

  useEffect(() => {
    if (authStatus === "authenticated" && session?.user?.id) {
      loadRecommendations();
    } else if (authStatus === "unauthenticated") {
      setLoading(loadingKey, false);
    }
  }, [authStatus, session?.user?.id]);

  const loadRecommendations = async () => {
    try {
      await fetchRecommendations('/api/courses/recommendations');
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRecommendations('/api/courses/recommendations?refresh=true');
      createPersistentNotification({
        type: 'info',
        title: 'Recommandation',
        message: 'Recommandation de cours mise à jour'
      });
    } catch (error) {
      // Erreur déjà gérée par le client API
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartCourse = async (courseId: string) => {
    try {
      await updateProgress('/api/courses/progress', {
        courseId,
        status: 'in_progress',
        startedAt: new Date().toISOString()
      });

      createPersistentNotification({
        type: 'success',
        title: 'Cours ajouté !',
        message: 'Le cours a été ajouté à vos cours en cours'
      });

      // Recharger les recommandations après avoir commencé un cours
      await loadRecommendations();
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "progression":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "popularité":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "récent":
        return <Clock className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "progression":
        return "bg-green-900/40 text-green-300 border-green-500/30";
      case "popularité":
        return "bg-blue-900/40 text-blue-300 border-blue-500/30";
      case "récent":
        return "bg-orange-900/40 text-orange-300 border-orange-500/30";
      default:
        return "bg-purple-900/40 text-purple-300 border-purple-500/30";
    }
  };

  // Si des cours sont fournis en props, utiliser ceux-ci
  if (courses && courses.length > 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {propTitle}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            {propSubtitle}
          </p>
        </div>
        
        {/* Grille responsive optimisée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              context="explorer"
            />
          ))}
        </div>
      </div>
    );
  }

  // Si pas de cours fournis et pas de recommandations
  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {propTitle}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            {propSubtitle}
          </p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Aucun cours disponible pour le moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            Recommandations pour vous
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Basé sur votre progression et vos préférences
          </p>
        </div>
      )}

      {/* Statistiques rapides */}
      {recommendations.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{recommendations.stats.totalCourses}</div>
            <div className="text-xs sm:text-sm text-gray-400">Cours total</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{recommendations.stats.completedCourses}</div>
            <div className="text-xs sm:text-sm text-gray-400">Terminés</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{Math.round(recommendations.stats.averageScore)}%</div>
            <div className="text-xs sm:text-sm text-gray-400">Score moyen</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-400">{recommendations.stats.topPlatform}</div>
            <div className="text-xs sm:text-sm text-gray-400">Plateforme préférée</div>
          </div>
        </div>
      )}

      {/* Grille de recommandations responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {recommendations.recommendations.map((course) => (
          <Card key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-blue-900/40 text-blue-300 border-blue-500/30 text-xs">
                      {course.platform}
                    </Badge>
                    {course.level_normalized && (
                      <Badge className="bg-gray-800 text-gray-300 text-xs">
                        {course.level_normalized}
                      </Badge>
                    )}
                  </div>
                </div>
                {course.rating_numeric && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{course.rating_numeric}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => handleStartCourse(course.id.toString())}
                >
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Commencer
                </Button>
                {course.link && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 h-8 sm:h-9 px-2 sm:px-3"
                    onClick={() => window.open(course.link, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 