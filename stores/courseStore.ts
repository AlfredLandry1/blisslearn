import { create } from 'zustand';
import type { Course, CourseWithProgress } from '@/types/next-auth';
import { apiClient } from '@/lib/api-client';

export interface GlobalStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  favoriteCourses: number;
  globalProgress: number;
  averageProgress: number;
  totalTimeSpent: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface CourseFilters {
  search: string;
  status: string;
  platform: string;
  level: string;
  language: string;
  favorite: string;
  sortBy: string;
  sortOrder: string;
}

interface CourseState {
  // Données
  courses: CourseWithProgress[];
  globalStats: GlobalStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  pagination: PaginationInfo | null;
  filters: CourseFilters;
  
  // Actions
  setCourses: (courses: CourseWithProgress[]) => void;
  setGlobalStats: (stats: GlobalStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationInfo) => void;
  setFilters: (filters: Partial<CourseFilters>) => void;
  resetFilters: () => void;
  
  // Actions pour les favoris
  toggleFavorite: (courseId: number) => void;
  toggleFavoriteWithSync: (courseId: number) => Promise<void>;
  updateCourseProgress: (courseId: number, progress: Partial<CourseWithProgress>) => void;
  removeCourse: (courseId: number) => void;
  
  // Actions pour recharger les données
  refreshCourses: (filters?: Partial<CourseFilters>, page?: number, limit?: number) => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Actions pour l'explorer
  setExplorerCourses: (courses: any[]) => void;
  
  // Computed values
  getFavoriteCourses: () => CourseWithProgress[];
  getCourseById: (id: number) => CourseWithProgress | undefined;
  getStats: () => GlobalStats | null;
  getFilteredCourses: () => CourseWithProgress[];
  
  // ✅ NOUVEAU : Méthode pour supprimer un cours avec synchronisation API
  removeCourseWithSync: (courseId: number) => Promise<void>;
}

const defaultFilters: CourseFilters = {
  search: '',
  status: 'all',
  platform: 'all',
  level: 'all',
  language: 'all',
  favorite: 'all',
  sortBy: 'updatedAt',
  sortOrder: 'desc'
};

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  globalStats: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: defaultFilters,

  setCourses: (courses) => set({ courses }),
  
  setGlobalStats: (globalStats) => set({ globalStats }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({ filters: defaultFilters }),

  toggleFavorite: (courseId) => {
    set((state) => {
      // Mettre à jour les cours
      const updatedCourses = state.courses.map(course => 
        course.id === courseId 
          ? { ...course, favorite: !course.favorite }
          : course
      );
      
      // Calculer les nouvelles statistiques
      const favoriteCourses = updatedCourses.filter(c => c.favorite).length;
      const totalProgress = updatedCourses.reduce((sum, course) => sum + course.progressPercentage, 0);
      const globalProgress = updatedCourses.length > 0 ? Math.round(totalProgress / updatedCourses.length) : 0;
      
      // Mettre à jour les statistiques globales
      const updatedGlobalStats = state.globalStats ? {
        ...state.globalStats,
        favoriteCourses,
        globalProgress
      } : null;
      
      return {
        courses: updatedCourses,
        globalStats: updatedGlobalStats
      };
    });
  },

  // ✅ NOUVEAU : Méthode pour basculer les favoris avec synchronisation API
  toggleFavoriteWithSync: async (courseId) => {
    try {
      const course = get().getCourseById(courseId);
      if (!course) {
        throw new Error('Cours non trouvé');
      }
      // Appeler l'API pour mettre à jour le favori
      await apiClient.patch(`/api/courses/${courseId}/favorite`, { favorite: !course.favorite });
      // Mettre à jour le store local
      get().toggleFavorite(courseId);
      console.log(`✅ Favori du cours ${courseId} mis à jour avec succès`);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du favori:', error);
      throw error;
    }
  },

  updateCourseProgress: (courseId, progress) => {
    set((state) => {
      // Mettre à jour le cours
      const updatedCourses = state.courses.map(course => 
        course.id === courseId 
          ? { ...course, ...progress }
          : course
      );
      
      // Recalculer les statistiques globales
      const totalCourses = updatedCourses.length;
      const completedCourses = updatedCourses.filter(c => c.status === "completed").length;
      const inProgressCourses = updatedCourses.filter(c => c.status === "in_progress").length;
      const favoriteCourses = updatedCourses.filter(c => c.favorite).length;
      const totalProgress = updatedCourses.reduce((sum, course) => sum + course.progressPercentage, 0);
      const globalProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;
      
      const updatedGlobalStats = {
        totalCourses,
        completedCourses,
        inProgressCourses,
        favoriteCourses,
        globalProgress,
        averageProgress: globalProgress,
        totalTimeSpent: updatedCourses.reduce((sum, course) => sum + (course.timeSpent || 0), 0)
      };
      
      return {
        courses: updatedCourses,
        globalStats: updatedGlobalStats
      };
    });
  },

  removeCourse: (courseId) => {
    set((state) => {
      // Mettre à jour les cours
      const updatedCourses = state.courses.filter(course => course.id !== courseId);
      
      // Recalculer les statistiques globales
      const totalCourses = updatedCourses.length;
      const completedCourses = updatedCourses.filter(c => c.status === "completed").length;
      const inProgressCourses = updatedCourses.filter(c => c.status === "in_progress").length;
      const favoriteCourses = updatedCourses.filter(c => c.favorite).length;
      const totalProgress = updatedCourses.reduce((sum, course) => sum + course.progressPercentage, 0);
      const globalProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;
      
      const updatedGlobalStats = {
        totalCourses,
        completedCourses,
        inProgressCourses,
        favoriteCourses,
        globalProgress,
        averageProgress: globalProgress,
        totalTimeSpent: updatedCourses.reduce((sum, course) => sum + (course.timeSpent || 0), 0)
      };
      
      return {
        courses: updatedCourses,
        globalStats: updatedGlobalStats
      };
    });
  },

  // ✅ NOUVEAU : Méthode pour supprimer un cours avec synchronisation API
  removeCourseWithSync: async (courseId) => {
    try {
      // Appeler l'API pour supprimer le cours
      await apiClient.delete(`/api/courses/${courseId}`);
      // Mettre à jour le store local
      get().removeCourse(courseId);
      console.log(`✅ Cours ${courseId} supprimé avec succès`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du cours:', error);
      throw error;
    }
  },

  refreshCourses: async (filters = {}, page = 1, limit = 12) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      // Construire les paramètres de requête
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(([_, value]) => 
            value !== '' && value !== 'all'
          )
        )
      });
      const response = await apiClient.get(`/api/courses/my-courses?${params}`);
      const data = response.data as any;
      set({
        courses: data.courses || [],
        globalStats: data.globalStats || null,
        pagination: data.pagination || null,
        filters: currentFilters,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  },

  refreshStats: async () => {
    try {
      const response = await apiClient.get("/api/courses/progress/stats");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }
      const statsData = response.data as any;
      set({ globalStats: statsData.globalStats });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Erreur inconnue" });
    }
  },

  // Actions pour l'explorer
  setExplorerCourses: (courses) => {
    set((state) => {
      // Créer un map des cours existants avec leurs données de progression
      const existingCoursesMap = new Map(
        state.courses.map(course => [course.id, course])
      );
      
      // Fusionner les nouveaux cours avec les données de progression existantes
      const mergedCourses = courses.map(course => {
        const existingCourse = existingCoursesMap.get(course.id);
        return {
          ...course,
          // Préserver les données de progression du store si elles existent
          status: existingCourse?.status || course.status || 'not_started',
          progressPercentage: existingCourse?.progressPercentage || course.progressPercentage || 0,
          favorite: existingCourse?.favorite || false,
          notes: existingCourse?.notes || null,
          timeSpent: existingCourse?.timeSpent || null,
          currentPosition: existingCourse?.currentPosition || null,
        };
      });
      
      return { courses: mergedCourses };
    });
  },

  // Computed values
  getFavoriteCourses: () => get().courses.filter(course => course.favorite),
  
  getCourseById: (id) => get().courses.find(course => course.id === id),
  
  getStats: () => get().globalStats,

  getFilteredCourses: () => {
    const { courses, filters } = get();
    let filtered = [...courses];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.platform?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(course => course.status === filters.status);
    }

    if (filters.platform && filters.platform !== 'all') {
      filtered = filtered.filter(course => course.platform === filters.platform);
    }

    if (filters.level && filters.level !== 'all') {
      filtered = filtered.filter(course => course.level_normalized === filters.level);
    }

    // if (filters.language && filters.language !== 'all') {
    //   filtered = filtered.filter(course => course.language === filters.language);
    // }

    if (filters.favorite === 'true') {
      filtered = filtered.filter(course => course.favorite);
    } else if (filters.favorite === 'false') {
      filtered = filtered.filter(course => !course.favorite);
    }

    return filtered;
  },
}));