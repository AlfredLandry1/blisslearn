"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Clock,
  Trash2,
  Settings
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { NotificationCard } from "@/components/dashboard/NotificationCard";
import { NotificationDetailModal } from "@/components/dashboard/NotificationDetailModal";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: string;
  isRead: boolean;
  action?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Certification obtenue !",
    message: "Félicitations ! Vous avez obtenu la certification TypeScript avec un score de 92%.",
    type: "success",
    timestamp: "Il y a 2 heures",
    isRead: false,
    action: "Voir le certificat"
  },
  {
    id: "2",
    title: "Webinar à venir",
    message: "Rappel : Webinar React Hooks demain à 14h00. N'oubliez pas de vous connecter !",
    type: "info",
    timestamp: "Il y a 4 heures",
    isRead: false,
    action: "Rejoindre"
  },
  {
    id: "3",
    title: "Deadline approche",
    message: "Votre projet final doit être soumis dans 3 jours. Assurez-vous de le finaliser à temps.",
    type: "warning",
    timestamp: "Il y a 1 jour",
    isRead: true,
    action: "Voir le projet"
  },
  {
    id: "4",
    title: "Nouveau cours disponible",
    message: "Le cours 'Node.js et Express' est maintenant disponible. Commencez votre apprentissage !",
    type: "info",
    timestamp: "Il y a 2 jours",
    isRead: true,
    action: "Commencer"
  },
  {
    id: "5",
    title: "Problème de connexion",
    message: "Nous avons détecté un problème avec votre connexion. Veuillez vérifier vos paramètres.",
    type: "error",
    timestamp: "Il y a 3 jours",
    isRead: true,
    action: "Résoudre"
  },
  {
    id: "6",
    title: "Objectif atteint",
    message: "Vous avez atteint votre objectif mensuel de 50h d'apprentissage ! Continuez comme ça !",
    type: "success",
    timestamp: "Il y a 4 jours",
    isRead: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return CheckCircle;
    case "warning":
      return AlertCircle;
    case "error":
      return AlertCircle;
    case "info":
      return Info;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-400 bg-green-500/10 border-green-500/20";
    case "warning":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "error":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "info":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function NotificationsPage() {
  const notifications = useUIStore((s) => s.notifications);
  const unread = notifications.filter((n: any) => !n.read);
  const read = notifications.filter((n: any) => n.read);
  const unreadCount = unread.length;
  const markAsRead = useUIStore((s) => s.markAsRead);
  const markAllAsRead = useUIStore((s) => s.markAllAsRead);
  const removeNotificationById = useUIStore((s) => s.removeNotificationById);
  const { modals, openModal, closeModal, selectedNotificationId, setSelectedNotificationId } = useUIStore();
  const selectedNotif = notifications.find((n: any) => n.id === selectedNotificationId);
  const currentPage = useUIStore((s) => s.currentPage);
  const setCurrentPage = useUIStore((s) => s.setCurrentPage);
  const pageSize = useUIStore((s) => s.pageSize);
  const addNotification = useUIStore((s) => s.addNotification);

  // Pagination
  const paginated = (arr: any[]) => arr.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(notifications.length / pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Notifications
              </h1>
              <p className="text-gray-400">
                Restez informé de vos activités et événements
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {unreadCount} non lues
              </Badge>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            Marquer tout comme lu
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            Supprimer tout
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            Filtrer par type
          </Button>
        </div>

        {/* Bouton tout marquer comme lu */}
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unread.length === 0}>
            Tout marquer comme lu
          </Button>
        </div>

        {/* Bouton de test pour ajouter 4 notifications */}
        <div className="flex justify-end mb-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              addNotification({ id: genId(), type: "success", message: "Succès !", title: "Succès" });
              addNotification({ id: genId(), type: "error", message: "Erreur détectée.", title: "Erreur" });
              addNotification({ id: genId(), type: "info", message: "Information importante.", title: "Info" });
              addNotification({ id: genId(), type: "warning", message: "Attention requise.", title: "Avertissement" });
            }}
          >
            Créer 4 notifications de test
          </Button>
        </div>

        {/* Liste des notifications non lues */}
        <h2 className="text-lg font-semibold text-white mb-2 mt-8 flex items-center gap-2">
          Non lues
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
              {unreadCount}
            </span>
          )}
        </h2>
        {paginated(unread).length === 0 ? (
          <div className="p-4 text-gray-400">Aucune notification non lue.</div>
        ) : (
          <div className="divide-y divide-gray-800 rounded-lg overflow-hidden bg-gray-900/60 border border-gray-800">
            {paginated(unread).map((notification: any) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDetail={(id) => { setSelectedNotificationId(id); openModal('notificationDetailModal'); }}
                onDelete={removeNotificationById}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
              />
            ))}
          </div>
        )}

        {/* Liste des notifications lues */}
        <h2 className="text-lg font-semibold text-white mb-2 mt-8 flex items-center gap-2">
          Lues
          {read.length > 0 && (
            <span className="inline-flex items-center justify-center bg-gray-700 text-gray-200 text-xs font-bold rounded-full px-2 py-0.5 ml-2">
              {read.length}
            </span>
          )}
        </h2>
        {paginated(read).length === 0 ? (
          <div className="p-4 text-gray-400">Aucune notification lue.</div>
        ) : (
          <div className="divide-y divide-gray-800 rounded-lg overflow-hidden bg-gray-900/40 border border-gray-800">
            {paginated(read).map((notification: any) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDetail={(id) => { setSelectedNotificationId(id); openModal('notificationDetailModal'); }}
                onDelete={removeNotificationById}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
              />
            ))}
          </div>
        )}

        {/* Modale de détail notification */}
        <NotificationDetailModal
          open={!!modals.notificationDetailModal}
          onClose={() => { closeModal('notificationDetailModal'); setSelectedNotificationId(null); }}
          notification={selectedNotif}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
          onMarkAsRead={markAsRead}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={currentPage === i + 1 ? "secondary" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
                className="px-3"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 