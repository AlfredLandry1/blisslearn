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

    const response = await fetch(`/api/notifications?${params}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des notifications');
    }

    return response.json();
  }

  // Créer une nouvelle notification
  async createNotification(notification: Omit<Notification, 'id' | 'read' | 'readAt' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la notification');
    }

    return response.json();
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string, read: boolean = true): Promise<Notification> {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la notification');
    }

    return response.json();
  }

  // Supprimer une notification
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la notification');
    }
  }

  // Supprimer toutes les notifications (optionnellement seulement les lues)
  async deleteAllNotifications(readOnly: boolean = false): Promise<void> {
    const params = new URLSearchParams();
    if (readOnly) {
      params.append('read', 'true');
    }

    const response = await fetch(`/api/notifications?${params}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression des notifications');
    }
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