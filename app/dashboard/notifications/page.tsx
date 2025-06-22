"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Clock,
  Trash2,
  Settings,
  Search,
  Filter,
  X
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useMemo } from "react";
import { NotificationCard } from "@/components/dashboard/NotificationCard";
import { NotificationDetailModal } from "@/components/dashboard/NotificationDetailModal";

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

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function NotificationsPage() {
  const notifications = useUIStore((s) => s.notifications);
  const markAsRead = useUIStore((s) => s.markAsRead);
  const markAllAsRead = useUIStore((s) => s.markAllAsRead);
  const removeNotificationById = useUIStore((s) => s.removeNotificationById);
  const { modals, openModal, closeModal, selectedNotificationId, setSelectedNotificationId } = useUIStore();
  const selectedNotif = notifications.find((n: any) => n.id === selectedNotificationId);
  const currentPage = useUIStore((s) => s.currentPage);
  const setCurrentPage = useUIStore((s) => s.setCurrentPage);
  const pageSize = useUIStore((s) => s.pageSize);

  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrage des notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filtre par recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter((notification: any) =>
        notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((notification: any) => notification.type === typeFilter);
    }

    // Filtre par statut de lecture
    if (statusFilter === "unread") {
      filtered = filtered.filter((notification: any) => !notification.read);
    } else if (statusFilter === "read") {
      filtered = filtered.filter((notification: any) => notification.read);
    }

    return filtered;
  }, [notifications, searchTerm, typeFilter, statusFilter]);

  // Séparation des notifications filtrées
  const unread = filteredNotifications.filter((n: any) => !n.read);
  const read = filteredNotifications.filter((n: any) => n.read);
  const unreadCount = unread.length;

  // Pagination
  const paginated = (arr: any[]) => arr.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);

  // Réinitialiser les filtres
  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = searchTerm || typeFilter !== "all" || statusFilter !== "all";

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

        {/* Barre de recherche et filtres */}
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans les notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/60 border-gray-700 text-white placeholder-gray-400"
            />
            {searchTerm && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                <X className="w-3 h-3" />
                            </Button>
            )}
          </div>
                            
          {/* Boutons de filtres */}
          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Button 
                variant={showFilters ? "secondary" : "outline"}
                                  size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-gray-300"
                                >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
                                </Button>
              {hasActiveFilters && (
                              <Button 
                  variant="outline"
                                size="sm" 
                  onClick={clearFilters}
                  className="border-red-600 text-red-400 hover:bg-red-600/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </Button>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unread.length === 0}>
              Tout marquer comme lu
                              </Button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtre par type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Type de notification</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="success">Succès</SelectItem>
                      <SelectItem value="warning">Avertissement</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par statut */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="unread">Non lues</SelectItem>
                      <SelectItem value="read">Lues</SelectItem>
                    </SelectContent>
                  </Select>
                            </div>
                          </div>

              {/* Statistiques des filtres */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-sm text-gray-400">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} trouvée{filteredNotifications.length !== 1 ? 's' : ''}
                  {hasActiveFilters && ` sur ${notifications.length} total`}
                </span>
                <div className="flex items-center space-x-2">
                  {typeFilter !== "all" && (
                    <Badge variant="outline" className="border-blue-600 text-blue-400">
                      Type: {typeFilter}
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="outline" className="border-green-600 text-green-400">
                      Statut: {statusFilter === "unread" ? "Non lues" : "Lues"}
                    </Badge>
                        )}
                      </div>
                    </div>
                  </div>
          )}
        </div>

        {/* Résultats filtrés */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              {hasActiveFilters ? "Aucune notification trouvée" : "Aucune notification"}
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? "Essayez de modifier vos critères de recherche ou de réinitialiser les filtres."
                : "Vous n'avez pas encore de notifications."
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Liste des notifications non lues */}
            {unread.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-white mb-2 mt-8 flex items-center gap-2">
                  Non lues
                  <span className="inline-flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {unread.length}
                  </span>
                </h2>
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
              </>
            )}

            {/* Liste des notifications lues */}
            {read.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-white mb-2 mt-8 flex items-center gap-2">
                  Lues
                  <span className="inline-flex items-center justify-center bg-gray-700 text-gray-200 text-xs font-bold rounded-full px-2 py-0.5">
                    {read.length}
                  </span>
                </h2>
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
              </>
            )}
          </>
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