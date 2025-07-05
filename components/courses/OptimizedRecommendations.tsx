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
  Users,
  ArrowRight,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
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

interface OptimizedRecommendationsData {
  recommendations: Recommendation[];
  stats: {
    totalCourses: number;
    completedCourses: number;
    averageScore: number;
    topPlatform: string;
  };
}

interface OptimizedRecommendationsProps {
  className?: string;
}

export function OptimizedRecommendations({ className = "" }: OptimizedRecommendationsProps) {
  const { data: session, status: authStatus } = useSession();
  const [recommendations, setRecommendations] = useState<OptimizedRecommendationsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Utilisation du hook IA personnalisé pour le message
  const { recommendationMessage, loading: recommendationLoading } = useRecommendationMessage();

  const { createPersistentNotification } = useUIStore();

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
    get: fetchRecommendations,
    post: updateProgress
  } = useApiClient<OptimizedRecommendationsData>({
    onSuccess: (data) => {
      setRecommendations(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      createPersistentNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les recommandations optimisées'
      });
    }
  });

  useEffect(() => {
    if (authStatus === "authenticated" && session?.user?.id) {
      loadOptimizedRecommendations();
    }
  }, [authStatus, session?.user?.id]);

  const loadOptimizedRecommendations = async () => {
    try {
      // Utiliser le type 'all' pour obtenir les recommandations les plus pertinentes
      await fetchRecommendations('/api/courses/recommendations?limit=4&type=all');
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRecommendations('/api/courses/recommendations?limit=4&type=all&refresh=true');
      createPersistentNotification({
        type: 'info',
        title: 'Recommandations mises à jour',
        message: 'Vos recommandations optimisées ont été actualisées'
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
      await loadOptimizedRecommendations();
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
      case "similaire à vos cours préférés":
        return <Target className="w-4 h-4 text-purple-400" />;
      case "niveau suivant recommandé":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case "cours populaire et bien noté":
        return <Star className="w-4 h-4 text-pink-400" />;
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
      case "similaire à vos cours préférés":
        return "bg-purple-900/40 text-purple-300 border-purple-500/30";
      case "niveau suivant recommandé":
        return "bg-yellow-900/40 text-yellow-300 border-yellow-500/30";
      case "cours populaire et bien noté":
        return "bg-pink-900/40 text-pink-300 border-pink-500/30";
      default:
        return "bg-purple-900/40 text-purple-300 border-purple-500/30";
    }
  };

  // Si pas d'authentification, ne pas afficher
  if (authStatus !== "authenticated") {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec message IA personnalisé */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Recommandations optimisées
          </h2>
        </div>
        
        {/* Message IA personnalisé */}
        {recommendationMessage && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
            <p className="text-blue-300 text-sm">
              {recommendationMessage}
            </p>
          </div>
        )}
        
        <p className="text-gray-400 text-sm sm:text-base">
          Les 4 cours les plus pertinents selon votre profil et votre progression
        </p>
      </div>

      {/* Bouton de refresh */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || recommendationsLoading}
          className="flex items-center gap-2"
        >
          {refreshing || recommendationsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Actualiser les recommandations
        </Button>
      </div>

      {/* Affichage des recommandations */}
      {error ? (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-red-300 mb-4">{error}</p>
            <Button onClick={loadOptimizedRecommendations} variant="outline" size="sm">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : recommendationsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gray-800/40 border-gray-700/50 animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations?.recommendations && recommendations.recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.recommendations.map((recommendation) => (
            <Card
              key={recommendation.id}
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`text-xs ${getReasonColor(recommendation.reason)}`}>
                    <div className="flex items-center gap-1">
                      {getReasonIcon(recommendation.reason)}
                      {recommendation.reason.length > 20 
                        ? recommendation.reason.substring(0, 20) + '...' 
                        : recommendation.reason
                      }
                    </div>
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-medium">
                      {recommendation.rating_numeric?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {recommendation.title}
                </h3>
                
                <p className="text-gray-400 text-xs line-clamp-2">
                  {recommendation.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {recommendation.platform}
                  </Badge>
                  {recommendation.level_normalized && (
                    <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                      {recommendation.level_normalized}
                    </Badge>
                  )}
                </div>

                {/* Score de pertinence */}
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-3 h-3 text-green-400" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Pertinence</span>
                      <span>{Math.round(recommendation.score)}%</span>
                    </div>
                    <Progress value={Math.min(recommendation.score, 100)} className="h-2" />
                  </div>
                </div>

                <div className="flex gap-1">
                  {recommendation.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-gray-400 hover:text-blue-400"
                      onClick={() => window.open(recommendation.link, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-blue-400 hover:bg-blue-500/10 flex-1"
                    onClick={() => handleStartCourse(recommendation.id.toString())}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Commencer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800/40 border-gray-700/50">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Aucune recommandation disponible</h3>
            <p className="text-gray-400 text-sm mb-4">
              Complétez votre profil pour recevoir des recommandations personnalisées
            </p>
            <Button onClick={() => window.location.href = '/onboarding'}>
              Compléter mon profil
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistiques des recommandations */}
      {recommendations?.stats && (
        <Card className="bg-gray-800/40 border-gray-700/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-white font-semibold text-lg">
                  {recommendations.stats.totalCourses}
                </p>
                <p className="text-gray-400 text-xs">Cours disponibles</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {recommendations.stats.completedCourses}
                </p>
                <p className="text-gray-400 text-xs">Cours terminés</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {recommendations.stats.averageScore.toFixed(1)}
                </p>
                <p className="text-gray-400 text-xs">Score moyen</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {recommendations.stats.topPlatform}
                </p>
                <p className="text-gray-400 text-xs">Plateforme préférée</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 