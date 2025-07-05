"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import { OptimizedRecommendations } from "@/components/courses/OptimizedRecommendations";
import { CourseFilter, type CourseFilters } from "@/components/ui/course-filter";
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore } from "@/stores/courseStore";
import { PaginationWithSelector } from "@/components/ui/pagination";
import { CourseGrid } from "@/components/ui/responsive-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Clock, 
  Star, 
  PlayCircle,
  RefreshCw,
  Loader2,
  X,
  Eye
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";

const defaultFilters: CourseFilters = {
  search: "",
  status: "all",
  platform: "all",
  institution: "all",
  level: "all",
  language: "all",
  format: "all",
  price_numeric: 0,
  rating: "all",
  duration: "all",
  favorite: "all",
  sortBy: "updatedAt",
  sortOrder: "desc",
};

export default function MyCoursesPage() {
  const { data: session, status } = useSession();
  const [filters, setFilters] = useState<CourseFilters>(defaultFilters);
  const [availableFilters, setAvailableFilters] = useState({
    platforms: [],
    institutions: [],
    levels: [],
    languages: [],
    formats: [],
  });
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // ✅ UTILISATION DU STORE : Récupération des données depuis le store
  const { 
    courses, 
    isLoading, 
    error, 
    pagination, 
    globalStats,
    refreshCourses,
    removeCourseWithSync,
    toggleFavoriteWithSync,
    updateCourseProgress
  } = useCourseStore();

  const { addNotification, createPersistentNotification } = useUIStore();

  const {
    get: getFilters,
  } = useApiClient<any>({
    onError: (error) => {
      console.error('Erreur chargement filtres:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les filtres',
        duration: 5000
      });
    }
  });

  // Charger les filtres disponibles
  useEffect(() => {
    if (status === "authenticated" && !filtersLoaded) {
      getFilters('/api/courses/filters')
        .then(response => {
          if (response?.data) {
            setAvailableFilters(response.data);
          setFiltersLoaded(true);
          }
        });
    }
  }, [status, filtersLoaded]);

  // Charger les cours
  useEffect(() => {
    if (status === "authenticated") {
      refreshCourses(filters, pagination?.currentPage || 1, pagination?.itemsPerPage || 12);
    }
  }, [status, filters]);

  const handleCourseUpdate = (courseId: number, action: 'started' | 'stopped') => {
    updateCourseProgress(courseId, {
      status: action === 'started' ? 'in_progress' : 'not_started',
      progressPercentage: action === 'started' ? 0 : 0
    });
  };

  const handleRemoveCourse = async (courseId: number) => {
    try {
      await removeCourseWithSync(courseId);
      await createPersistentNotification({
        type: 'success',
        title: 'Cours supprimé',
        message: 'Le cours a été retiré de votre liste'
      });
    } catch (error) {
      await createPersistentNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le cours'
      });
    }
  };

  const handleToggleFavorite = async (courseId: number) => {
    try {
      await toggleFavoriteWithSync(courseId);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de mettre à jour le favori'
      });
    }
  };

  const handleFiltersChange = (newFilters: Partial<CourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== defaultFilters[key as keyof CourseFilters]
  );

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <OnboardingGuard requireOnboarding={false}>
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Mes cours suivis
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1">
              Gérez vos cours et suivez votre progression
            </p>
          </div>
          
          {/* ✅ SIMPLIFIÉ : Bouton d'actualisation uniquement */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshCourses(filters, pagination?.currentPage || 1, pagination?.itemsPerPage || 12)}
              disabled={isLoading}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
          </div>
        </div>

        {/* Section Recommandations optimisées */}
        <OptimizedRecommendations />

        {/* Filtres avancés */}
        {filtersLoaded ? (
          <CourseFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            availableFilters={availableFilters}
            variant="my-courses"
            className="bg-gray-800/50 border-gray-700"
            isMobile={false}
          />
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-gray-400">Chargement des filtres...</span>
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="space-y-6">
          {/* Statistiques et filtres actifs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {globalStats && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">{globalStats.totalCourses}</span>
                    <span className="text-gray-500">cours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{globalStats.completedCourses}</span>
                    <span className="text-gray-500">terminés</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">{globalStats.inProgressCourses}</span>
                    <span className="text-gray-500">en cours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">{globalStats.favoriteCourses}</span>
                    <span className="text-gray-500">favoris</span>
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Filtres actifs:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3 mr-1" />
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>

          {/* Liste des cours */}
          {isLoading ? (
            <CourseGrid>
              {Array.from({ length: 12 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </CourseGrid>
          ) : courses.length > 0 ? (
            <>
              <CourseGrid>
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    context="my-courses"
                    onCourseUpdate={handleCourseUpdate}
                  />
                ))}
              </CourseGrid>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <PaginationWithSelector
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={(page) => refreshCourses(filters, page, pagination.itemsPerPage)}
                  onItemsPerPageChange={(itemsPerPage) => refreshCourses(filters, 1, itemsPerPage)}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
                <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Aucun cours suivi
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {hasActiveFilters 
                    ? "Aucun cours ne correspond à vos filtres."
                    : "Vous n'avez pas encore de cours suivis."
                  }
                </p>
                {hasActiveFilters ? (
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="text-sm"
                  >
                    Réinitialiser les filtres
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard/explorer'}
                    className="text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Explorer les cours
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
    </OnboardingGuard>
  );
}
