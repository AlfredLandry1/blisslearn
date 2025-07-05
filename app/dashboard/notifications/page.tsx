"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { NotificationCard } from "@/components/dashboard/NotificationCard";
import { NotificationDetailModal } from "@/components/dashboard/NotificationDetailModal";
import { PersistentNotificationsList } from "@/components/dashboard/PersistentNotificationsList";
import { useUIStore } from "@/stores/uiStore";
import { useApiClient } from "@/hooks/useApiClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Check, X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingState } from "@/components/ui/loading-states";
import { AchievementMessage, MotivationMessage, ProgressMessage } from "@/components/ui/personalized-message";
import { usePersonalizedContent } from "@/hooks/usePersonalizedContent";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { 
    persistentNotifications, 
    unreadCount, 
    loadNotifications, 
    markNotificationAsRead, 
    deleteNotification: deleteNotificationFromStore 
  } = useUIStore();

  // ✅ SIMPLIFIÉ : Utilisation du store Zustand uniquement
  const {
    patch: markAsRead,
    delete: deleteNotification
  } = useApiClient<any>({
    onError: (error) => {
      console.error('Erreur API notification:', error);
    }
  });

  // Hook pour rafraîchir le contenu personnalisé
  const { refresh: refreshPersonalizedContent } = usePersonalizedContent();

  useEffect(() => {
    if (status === "authenticated") {
      // Charger les notifications via le store
      loadNotifications();
    }
  }, [status]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Appeler l'API
      await markAsRead(`/api/notifications/${notificationId}`, { read: true });
      // Mettre à jour le store
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // Appeler l'API
      await deleteNotification(`/api/notifications/${notificationId}`);
      // Mettre à jour le store
      await deleteNotificationFromStore(notificationId);
      
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(null);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  // Fonctions utilitaires pour les icônes et couleurs
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'info':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Filtrage des notifications valides (id unique et défini)
  const seenIds = new Set<string>();
  const validNotifications = persistentNotifications.filter(n => {
    if (!n.id || seenIds.has(n.id)) return false;
    seenIds.add(n.id);
    return true;
  });

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Notifications
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Restez informé de vos activités
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Messages personnalisés IA */}
        <div className="space-y-4 mb-8">
          <AchievementMessage 
            autoHide={true} 
            autoHideDelay={8000}
            className="opacity-0 animate-fade-in duration-500"
          />
          <MotivationMessage 
            showRefresh={true}
            onRefresh={refreshPersonalizedContent}
            className="opacity-0 animate-fade-in duration-500 delay-200"
          />
          <ProgressMessage 
            className="opacity-0 animate-fade-in duration-500 delay-400"
          />
        </div>

        {/* Notifications persistantes */}
        {persistentNotifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Notifications importantes</h2>
            <PersistentNotificationsList />
          </div>
        )}

        {/* Notifications normales (même liste que persistantes pour l'instant) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Toutes les notifications
            </h2>
            {persistentNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Marquer toutes comme lues
                    persistentNotifications.forEach(notif => {
                      if (!notif.read) handleMarkAsRead(notif.id);
                    });
                  }}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Tout marquer comme lu
                </Button>
              </div>
            )}
          </div>

          {validNotifications.length > 0 ? (
            <div className="space-y-3">
              {validNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDetail={handleNotificationClick}
                  onDelete={handleDeleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-400 text-sm">
                  Vous n'avez pas encore de notifications.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal de détail */}
        <NotificationDetailModal
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          notification={selectedNotification}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </DashboardLayout>
  );
} 