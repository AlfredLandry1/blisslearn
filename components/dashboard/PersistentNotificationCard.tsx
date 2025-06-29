"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle,
  X,
  Check,
  Clock,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useUIStore } from "@/stores/uiStore";
import { Notification } from "@/lib/notificationService";

interface PersistentNotificationCardProps {
  notification: Notification;
}

export function PersistentNotificationCard({ notification }: PersistentNotificationCardProps) {
  const { markNotificationAsRead, deleteNotification } = useUIStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'error':
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case 'warning':
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const handleMarkAsRead = async () => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNotification(notification.id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      if (notification.actionUrl.startsWith('http')) {
        window.open(notification.actionUrl, '_blank');
      } else {
        window.location.href = notification.actionUrl;
      }
    }
  };

  return (
    <Card className={`
      bg-gradient-to-br from-gray-900/80 to-gray-800/80 border backdrop-blur-sm
      transition-all duration-300 hover:border-gray-600/50
      ${notification.read ? 'border-gray-700/50 opacity-75' : 'border-blue-500/30'}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icône */}
          <div className="flex-shrink-0 mt-1">
            {getIcon(notification.type)}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                {notification.title && (
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {notification.message}
                </p>
              </div>
              
              {/* Badge de type */}
              <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                {notification.type}
              </Badge>
            </div>

            {/* Métadonnées */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>
                  {format(new Date(notification.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </span>
              </div>
              
              {notification.read && (
                <div className="flex items-center gap-1 text-green-400">
                  <Check className="w-3 h-3" />
                  <span>Lue</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!notification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-7 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marquer comme lue
                </Button>
              )}

              {notification.actionUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  className="h-7 text-xs border-blue-600 text-blue-400 hover:bg-blue-600/20"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {notification.actionText || "Voir plus"}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-7 w-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 