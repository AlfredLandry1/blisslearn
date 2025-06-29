"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Grid3X3,
  List,
  Eye,
  X,
  Filter,
  RefreshCw,
  Search,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilter, type CourseFilters } from "@/components/ui/course-filter";
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore } from "@/stores/courseStore";
import { PaginationWithSelector } from "@/components/ui/pagination";
import { CourseGrid } from "@/components/ui/responsive-grid";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";

type ViewMode = "grid" | "table";

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

export default function ExplorerPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<CourseFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [availableFilters, setAvailableFilters] = useState({
    platforms: [],
    institutions: [],
    levels: [],
    languages: [],
    formats: [],
  });
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const { addNotification } = useUIStore();
  const { updateCourseProgress } = useCourseStore();

  useEffect(() => {
    if (status === "authenticated" && !filtersLoaded) {
      fetchAvailableFilters();
    }
  }, [status, filtersLoaded]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCourses();
    }
  }, [status, pagination.currentPage, pagination.itemsPerPage]);

  const fetchAvailableFilters = async () => {
    try {
      // ✅ NOUVEAU : Vérifier le cache localStorage
      const cachedFilters = localStorage.getItem('blisslearn_available_filters');
      const cacheTimestamp = localStorage.getItem('blisslearn_filters_timestamp');
      const now = Date.now();
      const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
      
      // Cache valide pendant 1 heure (3600000 ms)
      if (cachedFilters && cacheAge < 3600000) {
        console.log("✅ Utilisation des filtres en cache");
        const data = JSON.parse(cachedFilters);
        setAvailableFilters(data);
        setFiltersLoaded(true);
        return;
      }

      console.log("🔄 Chargement des filtres disponibles depuis l'API...");
      const response = await fetch("/api/courses/filters");
      if (response.ok) {
        const data = await response.json();
        
        // ✅ NOUVEAU : Sauvegarder en cache
        localStorage.setItem('blisslearn_available_filters', JSON.stringify(data));
        localStorage.setItem('blisslearn_filters_timestamp', now.toString());
        
        setAvailableFilters(data);
        setFiltersLoaded(true);
        console.log("✅ Filtres chargés et mis en cache");
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des filtres:", error);
      
      // ✅ NOUVEAU : Essayer d'utiliser le cache même s'il est expiré
      const cachedFilters = localStorage.getItem('blisslearn_available_filters');
      if (cachedFilters) {
        console.log("⚠️ Utilisation du cache expiré en cas d'erreur");
        const data = JSON.parse(cachedFilters);
        setAvailableFilters(data);
        setFiltersLoaded(true);
      } else {
        addNotification({
          type: "error",
          title: "Erreur",
          message: "Impossible de charger les filtres",
          duration: 5000
        });
      }
    }
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        search: filters.search,
        platform: filters.platform !== "all" ? filters.platform : "",
        institution: filters.institution !== "all" ? filters.institution : "",
        level: filters.level !== "all" ? filters.level : "",
        language: filters.language !== "all" ? filters.language : "",
        format: filters.format !== "all" ? filters.format : "",
        price_numeric: filters.price_numeric.toString(),
        rating: filters.rating !== "all" ? filters.rating : "",
        duration: filters.duration !== "all" ? filters.duration : "",
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/courses?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
        }));
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les cours",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseUpdate = (courseId: number, action: 'started' | 'stopped') => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            status: action === 'started' ? 'in_progress' : 'not_started',
            progressPercentage: action === 'started' ? 0 : 0
          }
        : course
    ));
  };

  const handleFiltersChange = (newFilters: Partial<CourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== defaultFilters[key as keyof CourseFilters]
  );

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Explorer les cours
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1">
              Découvrez des milliers de cours de qualité
            </p>
          </div>
          
          {/* Boutons de vue et actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCourses}
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
            
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grille</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Liste</span>
            </Button>
          </div>
        </div>

        {/* Filtres avancés */}
        <CourseFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          availableFilters={availableFilters}
          variant="explorer"
          className="bg-gray-800/50 border-gray-700"
        />

        {/* Résultats */}
        <div className="space-y-6">
          {/* Statistiques et filtres actifs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm sm:text-base">
                {pagination.totalItems} cours trouvés
              </p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Effacer tous les filtres
                </Button>
              )}
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Page {pagination.currentPage} sur {pagination.totalPages}
            </p>
          </div>

          {/* Grille de cours */}
          {isLoading ? (
            <CourseGrid>
              {Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </CourseGrid>
          ) : courses.length > 0 ? (
            <CourseGrid>
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  context="explorer"
                  onCourseUpdate={handleCourseUpdate}
                />
              ))}
            </CourseGrid>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-gray-400 text-sm sm:text-base mb-4">
                  Aucun cours trouvé avec ces critères.
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={handleResetFilters}
                    className="mt-4"
                  >
                    Effacer les filtres
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <PaginationWithSelector
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                itemsPerPage={pagination.itemsPerPage}
                onItemsPerPageChange={(itemsPerPage) => setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }))}
                totalItems={pagination.totalItems}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
