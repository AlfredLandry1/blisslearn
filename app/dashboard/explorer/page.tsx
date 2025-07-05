"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  X,
  RefreshCw,
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

export default function ExplorerPage() {
  const { data: session, status } = useSession();
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

  const {
    data: filtersData,
    loading: filtersLoading,
    error: filtersError,
    get: fetchFilters
  } = useApiClient<any>({
    onSuccess: (data) => {
      setAvailableFilters(data);
      setFiltersLoaded(true);
    },
    onError: (error) => {
      console.error('Erreur chargement filtres:', error);
      addNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les filtres'
      });
    }
  });

  const {
    get: fetchCourses
  } = useApiClient<any>({
    onSuccess: (data) => {
      setCourses(data.courses || []);
      setIsLoading(false);
      setPagination(prev => ({
        ...prev,
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0,
        itemsPerPage: data.pagination?.itemsPerPage || 12,
      }));
    },
    onError: () => {
      setIsLoading(false);
      setCourses([]);
    }
  });

  useEffect(() => {
    if (status === "authenticated" && !filtersLoaded) {
      fetchFilters('/api/courses/filters');
    }
  }, [status, filtersLoaded]);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        ),
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString()
      });
      fetchCourses(`/api/courses?${params}`);
    }
  }, [status, filters, pagination.currentPage, pagination.itemsPerPage]);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Explorer les cours
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1">
              Découvrez des milliers de cours de qualité
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
              }}
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

        {filtersLoaded ? (
          <CourseFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            availableFilters={availableFilters}
            variant="explorer"
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

        <div className="space-y-6">
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
