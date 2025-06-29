"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Star,
  CheckCircle,
  PlayCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  X,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import { CourseCard } from "@/components/courses/CourseCard";
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore } from "@/stores/courseStore";
import type { CourseWithProgress } from "@/types/next-auth";
import { PaginationWithSelector } from "@/components/ui/pagination";
import { useMyCoursesPagination } from "@/hooks/usePagination";
import { PageLoadingState } from "@/components/ui/loading-states";
import type { CourseFilters } from "@/stores/courseStore";

type ViewMode = "grid" | "table";

export default function MyCoursesPage() {
  const { status: authStatus } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    search: "",
    status: "all",
    platform: "all",
    level: "all",
    language: "all",
    favorite: "all",
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  // Store global
  const {
    courses,
    globalStats,
    pagination,
    filters,
    isLoading,
    error,
    refreshCourses,
    setFilters,
    resetFilters,
    removeCourse,
  } = useCourseStore();

  const { addNotification } = useUIStore();

  // ✅ NOUVEAU : Fonction pour arrêter un cours
  const handleStopCourse = (courseId: number) => {
    // Supprimer le cours du store
    removeCourse(courseId);
    addNotification({
      type: "success",
      title: "Cours supprimé",
      message: "Le cours a été retiré de vos cours suivis",
      duration: 3000
    });
  };

  // ✅ NOUVEAU : Fonction pour formater la durée
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}j`;
  };

  // Hook de pagination simplifié
  const paginationHook = useMyCoursesPagination({
    onPageChange: (page) => {
      // Utiliser les valeurs actuelles du store
      const currentFilters = filters;
      const currentLimit = pagination?.itemsPerPage || 12;
      refreshCourses(currentFilters, page, currentLimit);
    },
    onItemsPerPageChange: (itemsPerPage) => {
      // Utiliser les valeurs actuelles du store
      const currentFilters = filters;
      refreshCourses(currentFilters, 1, itemsPerPage);
    },
  });

  // Synchroniser la pagination du store avec le hook
  useEffect(() => {
    if (pagination) {
      paginationHook.setTotalItems(pagination.totalItems);
    }
  }, [pagination, paginationHook]);

  // Chargement initial des cours
  useEffect(() => {
    if (authStatus === "authenticated") {
      refreshCourses();
    }
  }, [authStatus, refreshCourses]);

  // Synchroniser les filtres temporaires avec les filtres actifs
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Appliquer les filtres temporaires
  const applyFilters = () => {
    setFilters(tempFilters);
    refreshCourses(tempFilters, 1);
  };

  // Réinitialiser les filtres
  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      status: "all",
      platform: "all",
      level: "all",
      language: "all",
      favorite: "all",
      sortBy: "updatedAt",
      sortOrder: "desc",
    };
    setTempFilters(defaultFilters);
    resetFilters();
    refreshCourses({}, 1);
  };

  // Mettre à jour les filtres temporaires sans les appliquer
  const handleTempFilterChange = (key: string, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.platform !== "all" ||
    filters.level !== "all" ||
    filters.language !== "all" ||
    filters.favorite !== "all";

  // Vérifier s'il y a des différences entre les filtres temporaires et actifs
  const hasFilterChanges = 
    tempFilters.search !== filters.search ||
    tempFilters.status !== filters.status ||
    tempFilters.platform !== filters.platform ||
    tempFilters.level !== filters.level ||
    tempFilters.language !== filters.language ||
    tempFilters.favorite !== filters.favorite;

  const platforms = [
    ...new Set(courses.map((course) => course.platform).filter(Boolean)),
  ] as string[];
  const levels = [
    ...new Set(courses.map((course) => course.level_normalized).filter(Boolean)),
  ] as string[];
  // const languages = [
  //   ...new Set(courses.map((course) => course.language).filter(Boolean)),
  // ] as string[];

  const content = () => {
    if (authStatus === "loading") {
      return <PageLoadingState message="Chargement de votre espace..." />;
    }
    if (authStatus !== "authenticated") {
      return (
        <div className="text-center text-gray-400 py-20">
          <h3 className="text-xl font-semibold mb-2">Accès restreint</h3>
          <p>Veuillez vous connecter pour voir vos cours suivis.</p>
          <Link href="/auth/login">
            <Button className="mt-4">Se connecter</Button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        {/* En-tête avec statistiques globales */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Mes cours suivis</h1>
          </div>

          {/* Statistiques globales en texte stylisé */}
          {globalStats && (
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Cours suivis:</span>
                <span className="text-white font-semibold">{globalStats.totalCourses}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">En cours:</span>
                <span className="text-blue-400 font-semibold">{globalStats.inProgressCourses}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Terminés:</span>
                <span className="text-green-400 font-semibold">{globalStats.completedCourses}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Favoris:</span>
                <span className="text-yellow-400 font-semibold">{globalStats.favoriteCourses}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Progression moyenne:</span>
                <span className="text-purple-400 font-semibold">{globalStats.averageProgress}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Temps total:</span>
                <span className="text-orange-400 font-semibold">{Math.round(globalStats.totalTimeSpent / 60 * 10) / 10}h</span>
              </div>
            </div>
          )}
        </div>

        {/* Filtres et contrôles */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter((v) => v !== "").length}
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                  Effacer
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <Card className="mb-6 bg-gray-900/60 border-gray-700">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Recherche
                    </label>
                    <Input
                      placeholder="Rechercher un cours..."
                      value={tempFilters.search}
                      onChange={(e) =>
                        handleTempFilterChange("search", e.target.value)
                      }
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Statut
                    </label>
                    <Select
                      value={tempFilters.status}
                      onValueChange={(value) =>
                        handleTempFilterChange("status", value)
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="not_started">
                          Non commencé
                        </SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Plateforme
                    </label>
                    <Select
                      value={tempFilters.platform}
                      onValueChange={(value) =>
                        handleTempFilterChange("platform", value)
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Toutes les plateformes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Toutes les plateformes
                        </SelectItem>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Favoris
                    </label>
                    <Select
                      value={tempFilters.favorite}
                      onValueChange={(value) =>
                        handleTempFilterChange("favorite", value)
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Tous les cours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les cours</SelectItem>
                        <SelectItem value="true">Favoris uniquement</SelectItem>
                        <SelectItem value="false">Non favoris</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boutons d'action pour les filtres */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={applyFilters}
                      disabled={!hasFilterChanges}
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Appliquer les filtres
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Réinitialiser
                    </Button>
                  </div>
                  {hasFilterChanges && (
                    <div className="text-sm text-yellow-400">
                      Modifications non sauvegardées
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Affichage des cours */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: paginationHook.itemsPerPage }).map(
              (_, index) => (
                <CourseCardSkeleton key={index} />
              )
            )}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Aucun cours trouvé</h3>
            <p>
              Vous n'avez pas encore de cours suivis ou aucun cours ne
              correspond à vos filtres.
            </p>
            <Link href="/dashboard/explorer">
              <Button className="mt-4">Explorer les cours</Button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                context="my-courses"
                onCourseUpdate={(courseId, action) => {
                  if (action === 'stopped') {
                    // Le cours a été supprimé, il sera automatiquement retiré du store
                    // grâce à la méthode removeCourse
                    console.log(`Cours ${courseId} supprimé de My Courses`);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300 font-medium">Cours</TableHead>
                    <TableHead className="text-gray-300 font-medium hidden sm:table-cell">Plateforme</TableHead>
                    <TableHead className="text-gray-300 font-medium hidden md:table-cell">Niveau</TableHead>
                    <TableHead className="text-gray-300 font-medium hidden lg:table-cell">Durée</TableHead>
                    <TableHead className="text-gray-300 font-medium">Progression</TableHead>
                    <TableHead className="text-gray-300 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white font-medium truncate">{course.title}</h3>
                            <p className="text-gray-400 text-sm truncate">{course.description}</p>
                            <div className="flex items-center gap-2 mt-1 sm:hidden">
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                {course.platform}
                              </Badge>
                              {course.level_normalized && (
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                  {course.level_normalized}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {course.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">
                        {course.level_normalized && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {course.level_normalized}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 hidden lg:table-cell">
                        {course.duration_hours && formatDuration(course.duration_hours)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progression</span>
                            <span className="text-white font-medium">
                              {course.progressPercentage || 0}%
                            </span>
                          </div>
                          <Progress
                            value={course.progressPercentage || 0}
                            className="h-2 bg-gray-700"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/my-courses/${course.id}/progress`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStopCourse(course.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && courses.length > 0 && pagination && (
          <div className="mt-8">
            <PaginationWithSelector
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={paginationHook.handlePageChange}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onItemsPerPageChange={paginationHook.handleItemsPerPageChange}
              variant="bliss"
            />
          </div>
        )}
      </div>
    );
  };

  return <DashboardLayout>{content()}</DashboardLayout>;
}
