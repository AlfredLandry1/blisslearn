"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PersistentNotificationsList } from "@/components/dashboard/PersistentNotificationsList";
import { TestNotificationButton } from "@/components/ui/TestNotificationButton";
import { useUIStore } from "@/stores/uiStore";

export default function NotificationsPage() {
  const { loadNotifications } = useUIStore();

  // Charger les notifications au montage de la page
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-400">
            Restez informé de vos activités et événements. Les notifications sont automatiquement supprimées après 15 jours.
          </p>
        </div>

        {/* Bouton de test (à retirer en production) */}
        <TestNotificationButton />

        {/* Liste des notifications persistantes */}
        <PersistentNotificationsList />
      </div>
    </DashboardLayout>
  );
} 