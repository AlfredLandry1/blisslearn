import { create } from "zustand";
import { notificationService, Notification as PersistentNotification } from "@/lib/notificationService";

// ✅ UTILITAIRE : Fonction pour créer des sélecteurs stables
const createStableSelector = <T>(selector: (state: any) => T) => {
  return (state: any): T => {
    try {
      return selector(state);
    } catch (error) {
      console.warn('Erreur dans le sélecteur Zustand:', error);
      return {} as T;
    }
  };
};

interface TempNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;
  actionUrl?: string;
  actionText?: string;
}

interface ModalState {
  [key: string]: boolean;
}

interface LoadingState {
  [key: string]: boolean;
}

interface FormDataState {
  [key: string]: any;
}

interface ErrorState {
  [key: string]: string;
}

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Notifications temporaires (pour l'affichage immédiat)
  notifications: TempNotification[];
  
  // Notifications persistantes
  persistentNotifications: PersistentNotification[];
  unreadCount: number;
  globalLoading: boolean;
  
  // Loading states
  loadingStates: LoadingState;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
  isKeyLoading: (key: string) => boolean;
  
  // Form data management - SIMPLIFIÉ
  formData: FormDataState;
  setFormData: (key: string, data: any) => void;
  updateFormData: (key: string, field: string, value: any) => void;
  clearFormData: (key: string) => void;
  getFormData: (key: string) => any;
  
  // Error management
  errors: ErrorState;
  setError: (key: string, message: string) => void;
  clearError: (key: string) => void;
  getError: (key: string) => string | null;
  hasError: (key: string) => boolean;
  
  // Actions pour les notifications temporaires
  addNotification: (notification: Omit<TempNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Actions pour les notifications persistantes
  loadNotifications: (page?: number, limit?: number) => Promise<void>;
  createPersistentNotification: (notification: Omit<PersistentNotification, 'id' | 'read' | 'readAt' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: (readOnly?: boolean) => Promise<void>;
  cleanupInvalidNotifications: () => Promise<void>;
  
  // Méthodes utilitaires pour les notifications persistantes
  showSuccess: (message: string, title?: string) => Promise<void>;
  showError: (message: string, title?: string) => Promise<void>;
  showInfo: (message: string, title?: string) => Promise<void>;
  showWarning: (message: string, title?: string) => Promise<void>;

  // Modals
  modals: ModalState;
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  isModalOpen: (key: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  // État initial
  sidebarOpen: true,
  notifications: [],
  persistentNotifications: [],
  unreadCount: 0,
  globalLoading: false,
  loadingStates: {},
  formData: {},
  errors: {},

  // Sidebar
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Loading states
  setLoading: (key: string, loading: boolean) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: loading }
  })),
  
  clearLoading: (key: string) => set((state) => {
    const newLoadingStates = { ...state.loadingStates };
    delete newLoadingStates[key];
    return { loadingStates: newLoadingStates };
  }),
  
  isKeyLoading: (key: string) => get().loadingStates[key] || false,

  // Form data management - SIMPLIFIÉ ET STABLE
  setFormData: (key: string, data: any) => set((state) => ({
    formData: { ...state.formData, [key]: data }
  })),
  
  updateFormData: (key: string, field: string, value: any) => set((state) => {
    const currentFormData = state.formData[key] || {};
    const newFormData = { ...currentFormData, [field]: value };
    
    // ✅ OPTIMISÉ : Éviter les mises à jour inutiles
    if (currentFormData[field] === value) {
      return state;
    }
    
    return {
      formData: { 
        ...state.formData, 
        [key]: newFormData
      }
    };
  }),
  
  clearFormData: (key: string) => set((state) => {
    const newFormData = { ...state.formData };
    delete newFormData[key];
    return { formData: newFormData };
  }),
  
  getFormData: (key: string) => get().formData[key] || {},

  // Error management
  setError: (key: string, message: string) => set((state) => ({
    errors: { ...state.errors, [key]: message }
  })),
  
  clearError: (key: string) => set((state) => {
    const newErrors = { ...state.errors };
    delete newErrors[key];
    return { errors: newErrors };
  }),
  
  getError: (key: string) => get().errors[key] || null,

  hasError: (key: string) => Boolean(get().errors[key]),

  // Actions pour les notifications temporaires
  addNotification: (notification) => {
    const id = `temp-${Date.now()}-${Math.random()}`;
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Supprimer automatiquement après la durée spécifiée
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Actions pour les notifications persistantes
  loadNotifications: async (page = 1, limit = 20) => {
    try {
      set({ globalLoading: true });
      const response = await notificationService.getNotifications(page, limit);
      
      // Filtrer les notifications valides et mettre à jour le store
      const validNotifications = response.notifications.filter(n => n && n.id);
      const newUnreadCount = validNotifications.filter(n => !n.read).length;
      
      set({
        persistentNotifications: validNotifications,
        unreadCount: newUnreadCount,
        globalLoading: false
      });
      
      console.log(`✅ ${validNotifications.length} notifications chargées (${newUnreadCount} non lues)`);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
      set({ globalLoading: false });
      
      // En cas d'erreur, vider le store pour éviter les désynchronisations
      set({
        persistentNotifications: [],
        unreadCount: 0
      });
    }
  },

  createPersistentNotification: async (notification) => {
    try {
      const newNotification = await notificationService.createNotification(notification);
      set((state) => ({
        persistentNotifications: [newNotification, ...state.persistentNotifications],
        unreadCount: state.unreadCount + 1
      }));
      await get().loadNotifications();
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      const updatedNotification = await notificationService.markAsRead(id);
      set((state) => ({
        persistentNotifications: state.persistentNotifications.map(n => 
          n.id === id ? updatedNotification : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      await get().loadNotifications();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la notification:", error);
      // Si la notification n'existe pas, la supprimer du store
      if (error instanceof Error && error.message.includes('Notification non trouvée')) {
        set((state) => ({
          persistentNotifications: state.persistentNotifications.filter(n => n.id !== id),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
        await get().loadNotifications();
      }
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationService.deleteNotification(id);
      set((state) => {
        const notification = state.persistentNotifications.find(n => n.id === id);
        return {
          persistentNotifications: state.persistentNotifications.filter(n => n.id !== id),
          unreadCount: notification && !notification.read 
            ? Math.max(0, state.unreadCount - 1) 
            : state.unreadCount
        };
      });
      await get().loadNotifications();
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      // Si la notification n'existe pas, la supprimer du store et recharger
      if (error instanceof Error && error.message.includes('404')) {
        set((state) => ({
          persistentNotifications: state.persistentNotifications.filter(n => n.id !== id),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
        await get().loadNotifications();
        // Notification temporaire utilisateur
        get().addNotification({
          type: "error",
          message: "La notification était déjà supprimée ou inaccessible.",
          duration: 5000
        });
      }
    }
  },

  deleteAllNotifications: async (readOnly = false) => {
    try {
      await notificationService.deleteAllNotifications(readOnly);
      
      if (readOnly) {
        set((state) => ({
          persistentNotifications: state.persistentNotifications.filter(n => !n.read)
        }));
      } else {
        set({
          persistentNotifications: [],
          unreadCount: 0
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications:", error);
    }
  },

  // Fonction pour nettoyer les notifications invalides
  cleanupInvalidNotifications: async () => {
    try {
      console.log("🧹 Nettoyage des notifications invalides...");
      
      // Recharger les notifications depuis la base de données
      const response = await notificationService.getNotifications(1, 100);
      const validNotifications = response.notifications.filter(n => n && n.id);
      const newUnreadCount = validNotifications.filter(n => !n.read).length;
      
      set({
        persistentNotifications: validNotifications,
        unreadCount: newUnreadCount
      });
      
      console.log(`✅ Nettoyage terminé: ${validNotifications.length} notifications valides (${newUnreadCount} non lues)`);
    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
    }
  },

  // Méthodes utilitaires
  showSuccess: async (message: string, title?: string) => {
    try {
      await get().createPersistentNotification({
        message,
        type: 'success',
        title
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage de la notification de succès:", error);
    }
  },

  showError: async (message: string, title?: string) => {
    try {
      await get().createPersistentNotification({
        message,
        type: 'error',
        title
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage de la notification d'erreur:", error);
    }
  },

  showInfo: async (message: string, title?: string) => {
    try {
      await get().createPersistentNotification({
        message,
        type: 'info',
        title
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage de la notification d'information:", error);
    }
  },

  showWarning: async (message: string, title?: string) => {
    try {
      await get().createPersistentNotification({
        message,
        type: 'warning',
        title
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage de la notification d'avertissement:", error);
    }
  },

  // Modals
  modals: {},
  openModal: (key) => set((state) => ({ modals: { ...state.modals, [key]: true } })),
  closeModal: (key) => set((state) => ({ modals: { ...state.modals, [key]: false } })),
  isModalOpen: (key) => get().modals[key] || false,
})); 