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
}

export const useUIStore = create<UIState>((set) => ({
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
})); 