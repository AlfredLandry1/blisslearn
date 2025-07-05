import { authenticatedApiClient } from './api-client';

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  readAt?: string;
  duration?: number;
  actionUrl?: string;
  actionText?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class NotificationService {
  // Récupérer les notifications
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<NotificationResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(unreadOnly && { unread: 'true' })
    });

    const response = await authenticatedApiClient.get(`/api/notifications?${params}`);
    return response.data as NotificationResponse;
  }

  // Créer une nouvelle notification
  async createNotification(notification: Omit<Notification, 'id' | 'read' | 'readAt' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const response = await authenticatedApiClient.post('/api/notifications', notification);
    return response.data as Notification;
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string, read: boolean = true): Promise<Notification> {
    try {
      const response = await authenticatedApiClient.patch(`/api/notifications/${notificationId}`, { read });
      return response.data as Notification;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
      throw error;
    }
  }

  // Supprimer une notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await authenticatedApiClient.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  // Supprimer toutes les notifications (optionnellement seulement les lues)
  async deleteAllNotifications(readOnly: boolean = false): Promise<void> {
    const params = new URLSearchParams();
    if (readOnly) {
      params.append('read', 'true');
    }

    await authenticatedApiClient.delete(`/api/notifications?${params}`);
  }

  // Créer une notification avec des paramètres simplifiés
  async showNotification(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string,
    duration?: number,
    actionUrl?: string,
    actionText?: string
  ): Promise<Notification> {
    return this.createNotification({
      message,
      type,
      title,
      duration,
      actionUrl,
      actionText,
    });
  }

  // Méthodes utilitaires pour les types de notifications courants
  async showSuccess(message: string, title?: string): Promise<Notification> {
    return this.showNotification(message, 'success', title);
  }

  async showError(message: string, title?: string): Promise<Notification> {
    return this.showNotification(message, 'error', title);
  }

  async showInfo(message: string, title?: string): Promise<Notification> {
    return this.showNotification(message, 'info', title);
  }

  async showWarning(message: string, title?: string): Promise<Notification> {
    return this.showNotification(message, 'warning', title);
  }
}

export const notificationService = new NotificationService(); 