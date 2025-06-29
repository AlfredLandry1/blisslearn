"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore } from "@/stores/courseStore";
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { PaginationWithSelector } from "@/components/ui/pagination";
import { useCoursePagination } from "@/hooks/usePagination";
import { Search, Filter, X } from "lucide-react";
import { PaginationInfo } from "@/stores/courseStore";

function NativeSelect({ name, defaultValue, options, label }: { name: string; defaultValue?: string; options: string[]; label: string }) {
  return (
    <select name={name} defaultValue={defaultValue} className="w-40 bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-2">
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export default function CoursesPageClient({
  courses: initialCourses,
  searchParams,
  filters,
  pagination: initialPagination,
}: {
  courses: any[];
  searchParams: any;
  filters: { platforms: string[]; levels: string[]; languages: string[] };
  pagination?: any;
}) {
  const { platforms, levels, languages } = filters;
  const search = searchParams?.search || "";
  const platform = searchParams?.platform || "";
  const level = searchParams?.level || "";
  const language = searchParams?.language || "";
  const sortBy = searchParams?.sortBy || "title";
  const sortOrder = searchParams?.sortOrder || "asc";

  const { 
    isKeyLoading, 
    setLoading, 
    clearLoading, 
    setError, 
    clearError, 
    getError 
  } = useUIStore();

  const { setExplorerCourses, courses: storeCourses } = useCourseStore();

  const loadingKey = "courses-explorer";
  const errorKey = "courses-explorer-error";

  // État local pour la pagination
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Hook de pagination
  const pagination = useCoursePagination({
    onPageChange: (page) => {
      fetchCourses(page);
    },
    onItemsPerPageChange: (itemsPerPage) => {
      fetchCourses(1, itemsPerPage);
    }
  });

  // Fonction pour récupérer les cours avec pagination
  const fetchCourses = async (page: number, limit?: number) => {
    setIsLoadingData(true);
    setLoading(loadingKey, true);
    clearError(errorKey);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: (limit || pagination.itemsPerPage).toString(),
        ...(search && { search }),
        ...(platform && { platform }),
        ...(level && { level }),
        ...(language && { language }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });

      const response = await fetch(`/api/courses?${params}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des cours");
      }

      const data = await response.json();
      
      // Mettre à jour le store global
      setExplorerCourses(data.courses);
      setTotalItems(data.pagination.totalItems);
      pagination.setTotalItems(data.pagination.totalItems);
      
    } catch (error) {
      setError(errorKey, "Erreur lors du chargement des cours");
    } finally {
      setIsLoadingData(false);
      setLoading(loadingKey, false);
    }
  };

  // Chargement initial
  useEffect(() => {
    if (initialCourses.length > 0) {
      // Initialiser le store global avec les cours du serveur
      setExplorerCourses(initialCourses);
      // Estimer le total des items si pas fourni
      if (totalItems === 0) {
        setTotalItems(initialCourses.length);
        pagination.setTotalItems(initialCourses.length);
      }
    }
    
    // Initialiser la pagination avec les données du serveur si disponibles
    if (initialPagination) {
      setTotalItems(initialPagination.totalItems);
      pagination.setTotalItems(initialPagination.totalItems);
    }
  }, [initialCourses, initialPagination, setExplorerCourses]);

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const newFilters = {
      search: formData.get('search') as string,
      platform: formData.get('platform') as string,
      level: formData.get('level') as string,
      language: formData.get('language') as string,
    };

    // Mettre à jour l'URL avec les nouveaux filtres
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1'); // Retour à la première page
    params.set('limit', pagination.itemsPerPage.toString());

    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    // Recharger les cours avec les nouveaux filtres
    await fetchCourses(1);
  };

  const clearFilters = () => {
    window.history.pushState({}, '', window.location.pathname);
    fetchCourses(1);
  };

  const loading = isKeyLoading(loadingKey) || isLoadingData;
  const error = getError(errorKey);

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = search || platform || level || language;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Explorer les cours</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">Découvrez, suivez et progressez dans des milliers de cours issus des meilleures plateformes. Votre aventure commence ici.</p>
      
      <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 mb-8 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            name="search"
            placeholder="Rechercher un cours, une compétence..."
            defaultValue={search}
            className="w-64 pl-10"
          />
        </div>
        <NativeSelect name="platform" defaultValue={platform} options={platforms} label="Plateforme" />
        <NativeSelect name="level" defaultValue={level} options={levels} label="Niveau" />
        <NativeSelect name="language" defaultValue={language} options={languages} label="Langue" />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner loadingKey="filter-spinner" size="sm" />
              Filtrage...
            </>
          ) : (
            <>
              <Filter className="w-4 h-4" />
              Filtrer
            </>
          )}
        </button>
        
        {hasActiveFilters && (
          <button 
            type="button"
            onClick={clearFilters}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Effacer
          </button>
        )}
      </form>

      <ErrorDisplay errorKey={errorKey} variant="banner" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Affichage des skeletons pendant le chargement
          Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))
        ) : storeCourses.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 border-2 border-dashed border-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Aucun cours trouvé</h3>
            <p>Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        ) : (
          // Affichage des cours
          storeCourses.map((course: any) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              context="explorer"
              onCourseUpdate={(courseId, action) => {
                if (action === 'started') {
                  console.log(`Cours ${courseId} ajouté depuis Explorer`);
                } else if (action === 'stopped') {
                  console.log(`Cours ${courseId} retiré depuis Explorer`);
                }
              }}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && storeCourses.length > 0 && (
        <div className="mt-8">
          <PaginationWithSelector
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.handlePageChange}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={pagination.totalItems}
            onItemsPerPageChange={pagination.handleItemsPerPageChange}
            variant="bliss"
          />
        </div>
      )}
    </DashboardLayout>
  );
} 