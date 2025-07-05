"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationWithSelector } from "@/components/ui/pagination";
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  RefreshCw,
  Filter,
  Search,
  Info,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { PersistentNotificationCard } from "./PersistentNotificationCard";
import { Input } from "@/components/ui/input";
import { NotificationDetailModal } from "./NotificationDetailModal";

export function PersistentNotificationsList() {
  const {
    persistentNotifications,
    unreadCount,
    isKeyLoading,
    loadNotifications,
    deleteAllNotifications,
    markNotificationAsRead
  } = useUIStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadingKey = "persistent-notifications";
  const isLoading = isKeyLoading(loadingKey);

  // ✅ CORRIGÉ : Charger les notifications sans dépendances instables
  useEffect(() => {
    // Charger seulement si on n'a pas de notifications ou si on change de page
    if (persistentNotifications.length === 0 || currentPage > 1) {
      // Utiliser setTimeout pour éviter les conflits de rendu
      setTimeout(() => {
        loadNotifications(currentPage, itemsPerPage);
      }, 0);
    }
  }, [currentPage, itemsPerPage, persistentNotifications.length]); // ✅ Suppression de loadNotifications

  // Filtrer les notifications selon l'onglet actif
  let filteredNotifications = persistentNotifications.filter(notification => {
    const matchesSearch = searchTerm === "" || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.title && notification.title.toLowerCase().includes(searchTerm.toLowerCase()));

    switch (activeTab) {
      case "unread":
        return !notification.read && matchesSearch;
      case "read":
        return notification.read && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  // Filtrer les notifications sans id ou avec id dupliqué
  const seenIds = new Set<string>();
  filteredNotifications = filteredNotifications.filter(n => {
    if (!n.id || seenIds.has(n.id)) return false;
    seenIds.add(n.id);
    return true;
  });

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = filteredNotifications.filter(n => !n.read && n.id);
    let errors = 0;
    for (const notification of unreadNotifications) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (error: any) {
        if (error?.message?.includes('404')) {
          // On ignore l'erreur 404 (notification déjà supprimée)
          continue;
        } else {
          errors++;
        }
      }
    }
    if (errors > 0) {
      alert('Certaines notifications n\'ont pas pu être marquées comme lues.');
    }
  };

  const handleDeleteAll = async (readOnly = false) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${readOnly ? 'toutes les notifications lues' : 'toutes les notifications'} ?`)) {
      await deleteAllNotifications(readOnly);
      loadNotifications(currentPage, itemsPerPage);
    }
  };

  const handleRefresh = () => {
    loadNotifications(currentPage, itemsPerPage);
  };

  const getNotificationStats = () => {
    const total = persistentNotifications.length;
    const unread = persistentNotifications.filter(n => !n.read).length;
    const read = total - unread;

    return { total, unread, read };
  };

  const stats = getNotificationStats();

  const handleShowDetail = (notification: any) => {
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
        return Info;
    }
  };
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (isLoading && persistentNotifications.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            <span className="ml-2 text-gray-400">Chargement des notifications...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-400" />
            <CardTitle className="text-white">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-blue-600 text-white">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Total:</span>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {stats.total}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Non lues:</span>
            <Badge className="bg-blue-600 text-white">
              {stats.unread}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Lues:</span>
            <Badge variant="outline" className="border-green-600 text-green-400">
              {stats.read}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans les notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/60 border-gray-700 text-gray-300 placeholder-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="bg-gray-800/60 border border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
              Toutes ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-blue-600">
              Non lues ({stats.unread})
            </TabsTrigger>
            <TabsTrigger value="read" className="data-[state=active]:bg-blue-600">
              Lues ({stats.read})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Actions en lot */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Actions en lot:</span>
            
            {stats.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-7 text-xs border-green-600 text-green-400 hover:bg-green-600/20"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Tout marquer comme lu
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteAll(true)}
              className="h-7 text-xs border-orange-600 text-orange-400 hover:bg-orange-600/20"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer les lues
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteAll(false)}
              className="h-7 text-xs border-red-600 text-red-400 hover:bg-red-600/20"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Tout supprimer
            </Button>
          </div>
        )}

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm 
                ? "Aucune notification ne correspond à votre recherche."
                : activeTab === "unread" 
                  ? "Aucune notification non lue."
                  : activeTab === "read"
                    ? "Aucune notification lue."
                    : "Aucune notification pour le moment."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <PersistentNotificationCard
                key={notification.id}
                notification={notification}
                onShowDetail={handleShowDetail}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6">
            <PaginationWithSelector
              currentPage={currentPage}
              totalPages={Math.ceil(filteredNotifications.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredNotifications.length}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[5, 10, 20, 50]}
              variant="bliss"
            />
          </div>
        )}

        {/* Modal de détail notification */}
        <NotificationDetailModal
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          notification={selectedNotification}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
        />
      </CardContent>
    </Card>
  );
} 