import { useEffect, useCallback, useRef } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function useNotifications() {
  const {
    persistentNotifications,
    unreadCount,
    loadNotifications,
    createPersistentNotification,
    markNotificationAsRead,
    deleteNotification,
    cleanupInvalidNotifications
  } = useUIStore();

  const hasLoadedRef = useRef(false);

  // Charger les notifications une seule fois au montage sans dépendances instables
  useEffect(() => {
    if (!hasLoadedRef.current && persistentNotifications.length === 0) {
      hasLoadedRef.current = true;
      // Utiliser setTimeout pour éviter les conflits de rendu
      setTimeout(() => {
        loadNotifications();
      }, 0);
    }
  }, []);

  // Fonctions mémorisées avec des dépendances stables
  const handleLoadNotifications = useCallback((page = 1, limit = 20) => {
    loadNotifications(page, limit);
  }, []);

  const handleCreateNotification = useCallback(async (notification: any) => {
    try {
      await createPersistentNotification(notification);
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }, []);

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, []);

  const handleDeleteNotification = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }, []);

  const handleCleanup = useCallback(async () => {
    try {
      await cleanupInvalidNotifications();
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }, []);

  return {
    notifications: persistentNotifications,
    unreadCount,
    isLoading: persistentNotifications.length === 0 && hasLoadedRef.current,
    loadNotifications: handleLoadNotifications,
    createNotification: handleCreateNotification,
    markAsRead: handleMarkAsRead,
    deleteNotification: handleDeleteNotification,
    cleanup: handleCleanup
  };
} 