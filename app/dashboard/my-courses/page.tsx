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
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import { CourseCard } from "@/components/courses/CourseCard";
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore, type CourseWithProgress } from "@/stores/courseStore";
import { PaginationWithSelector } from "@/components/ui/pagination";
import { useMyCoursesPagination } from "@/hooks/usePagination";
import { PageLoadingState } from "@/components/ui/loading-states";

type ViewMode = "grid" | "table";

export default function MyCoursesPage() {
  const { status: authStatus } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

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
  } = useCourseStore();

  const { addNotification } = useUIStore();

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

  // Appliquer les filtres
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
    // Recharger les cours avec les nouveaux filtres
    refreshCourses({ ...filters, [key]: value }, 1);
  };

  // Réinitialiser les filtres
  const clearFilters = () => {
    resetFilters();
    refreshCourses({}, 1);
  };

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.platform !== "all" ||
    filters.level !== "all" ||
    filters.language !== "all" ||
    filters.favorite !== "all";

  const platforms = [
    ...new Set(courses.map((course) => course.platform).filter(Boolean)),
  ] as string[];
  const levels = [
    ...new Set(courses.map((course) => course.level).filter(Boolean)),
  ] as string[];
  const languages = [
    ...new Set(courses.map((course) => course.language).filter(Boolean)),
  ] as string[];

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

          {/* Statistiques globales simplifiées */}
          {globalStats && (
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">
                  {globalStats.totalCourses}
                </span>
                <span>cours suivis</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">
                  {globalStats.inProgressCourses}
                </span>
                <span>en cours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white font-semibold">
                  {globalStats.completedCourses}
                </span>
                <span>terminés</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">
                  {globalStats.favoriteCourses}
                </span>
                <span>favoris</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Recherche
                    </label>
                    <Input
                      placeholder="Rechercher un cours..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Statut
                    </label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        handleFilterChange("status", value)
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
                      value={filters.platform}
                      onValueChange={(value) =>
                        handleFilterChange("platform", value)
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
                      value={filters.favorite}
                      onValueChange={(value) =>
                        handleFilterChange("favorite", value)
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
          <Card className="bg-gray-900/60 border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300 w-12">#</TableHead>
                  <TableHead className="text-gray-300">Cours</TableHead>
                  <TableHead className="text-gray-300">Plateforme</TableHead>
                  <TableHead className="text-gray-300">Statut</TableHead>
                  <TableHead className="text-gray-300">Progression</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, index) => {
                  // Calculer le numéro réel en tenant compte de la pagination
                  const courseNumber = (pagination?.currentPage || 1) * (pagination?.itemsPerPage || 12) - (pagination?.itemsPerPage || 12) + index + 1;
                  
                  return (
                    <TableRow key={course.id} className="border-gray-700">
                      <TableCell className="text-gray-400 font-mono text-sm">
                        {courseNumber}
                      </TableCell>
                      <TableCell className="text-white max-w-xs">
                        <div className="truncate" title={course.title}>
                          {course.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {course.platform}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "completed"
                              ? "default"
                              : course.status === "in_progress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {course.status === "completed"
                            ? "Terminé"
                            : course.status === "in_progress"
                            ? "En cours"
                            : "Non commencé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Progression</span>
                            <span className="text-white font-medium">
                              {course.progressPercentage}%
                            </span>
                          </div>
                          <Progress
                            value={course.progressPercentage}
                            className="h-2 w-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/my-courses/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
