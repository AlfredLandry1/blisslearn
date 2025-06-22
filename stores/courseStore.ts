import { create } from 'zustand';

export interface CourseWithProgress {
  id: number;
  title: string;
  status: string;
  favorite: boolean;
  progressPercentage: number;
  platform: string | null;
  level: string | null;
  language: string | null;
  notes: string | null;
  timeSpent: number | null;
  currentPosition: string | null;
}

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

      const response = await fetch(`/api/courses/my-courses?${params}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }

      const data = await response.json();

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
      const response = await fetch("/api/courses/progress/stats");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }

      const statsData = await response.json();
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
      filtered = filtered.filter(course => course.level === filters.level);
    }

    if (filters.language && filters.language !== 'all') {
      filtered = filtered.filter(course => course.language === filters.language);
    }

    if (filters.favorite === 'true') {
      filtered = filtered.filter(course => course.favorite);
    } else if (filters.favorite === 'false') {
      filtered = filtered.filter(course => !course.favorite);
    }

    return filtered;
  },
}));