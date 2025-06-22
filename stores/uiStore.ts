import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
}

export interface ModalState {
  [key: string]: boolean;
  // Exemples : loginModal, settingsModal, onboardingModal, etc.
}

export interface ConfirmationState {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setNotifications: (notifs: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotificationById: (id: string) => void;

  modals: ModalState;
  openModal: (modal: string) => void;
  closeModal: (modal: string) => void;
  closeAllModals: () => void;

  selectedNotificationId: string | null;
  setSelectedNotificationId: (id: string | null) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  loadingStates: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  isLoading: (key: string) => boolean;

  errors: Record<string, string>;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  hasError: (key: string) => boolean;
  getError: (key: string) => string | null;

  formData: Record<string, any>;
  setFormData: (formKey: string, data: any) => void;
  updateFormData: (formKey: string, field: string, value: any) => void;
  clearFormData: (formKey: string) => void;
  getFormData: (formKey: string) => any;

  confirmations: Record<string, ConfirmationState>;
  showConfirmation: (key: string, confirmation: ConfirmationState) => void;
  hideConfirmation: (key: string) => void;
  clearAllConfirmations: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  notifications: [],
  addNotification: (notif) => set((state) => ({ notifications: [...state.notifications, notif] })),
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),
  setNotifications: (notifs) => set({ notifications: notifs }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  removeNotificationById: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  modals: {},
  openModal: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: true } })),
  closeModal: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: false } })),
  closeAllModals: () => set({ modals: {} }),

  selectedNotificationId: null,
  setSelectedNotificationId: (id) => set({ selectedNotificationId: id }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  pageSize: 6,
  setPageSize: (size) => set({ pageSize: size }),

  loadingStates: {},
  setLoading: (key, loading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: loading }
  })),
  clearLoading: (key) => set((state) => {
    const newLoadingStates = { ...state.loadingStates };
    delete newLoadingStates[key];
    return { loadingStates: newLoadingStates };
  }),
  clearAllLoading: () => set({ loadingStates: {} }),
  isLoading: (key) => get().loadingStates[key] || false,

  errors: {},
  setError: (key, error) => set((state) => ({
    errors: { ...state.errors, [key]: error }
  })),
  clearError: (key) => set((state) => {
    const newErrors = { ...state.errors };
    delete newErrors[key];
    return { errors: newErrors };
  }),
  clearAllErrors: () => set({ errors: {} }),
  hasError: (key) => !!get().errors[key],
  getError: (key) => get().errors[key] || null,

  formData: {},
  setFormData: (formKey, data) => set((state) => ({
    formData: { ...state.formData, [formKey]: data }
  })),
  updateFormData: (formKey, field, value) => set((state) => ({
    formData: {
      ...state.formData,
      [formKey]: {
        ...state.formData[formKey],
        [field]: value
      }
    }
  })),
  clearFormData: (formKey) => set((state) => {
    const newFormData = { ...state.formData };
    delete newFormData[formKey];
    return { formData: newFormData };
  }),
  getFormData: (formKey) => get().formData[formKey] || {},

  confirmations: {},
  showConfirmation: (key, confirmation) => set((state) => ({
    confirmations: { ...state.confirmations, [key]: confirmation }
  })),
  hideConfirmation: (key) => set((state) => {
    const newConfirmations = { ...state.confirmations };
    delete newConfirmations[key];
    return { confirmations: newConfirmations };
  }),
  clearAllConfirmations: () => set({ confirmations: {} }),
})); 