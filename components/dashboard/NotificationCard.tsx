import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface NotificationCardProps {
  notification: any;
  onMarkAsRead?: (id: string) => void;
  onDetail?: (id: string) => void;
  onDelete?: (id: string) => void;
  getNotificationIcon: (type: string) => React.ElementType;
  getNotificationColor: (type: string) => string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDetail,
  onDelete,
  getNotificationIcon,
  getNotificationColor,
}) => {
  const NotificationIcon = getNotificationIcon(notification.type);
  const isRead = Boolean((notification as any).read);
  return (
    <div className={`group flex items-start gap-4 p-5 hover:bg-${isRead ? 'gray-800/40' : 'blue-950/30'} transition-colors relative ${isRead ? 'opacity-70' : ''}`}>
      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center`}>
      {React.createElement(NotificationIcon as any, { className: "w-5 h-5" })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-base text-white line-clamp-1">{notification.title}</h4>
          {isRead ? (
            <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 font-medium">Lue</span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">Non lue</span>
          )}
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">{notification.message}</p>
        {(notification as any).date && (
          <div className="text-xs text-gray-500 mt-1">{formatDate((notification as any).date)}</div>
        )}
        <div className="flex gap-2 mt-3">
          {!isRead && onMarkAsRead && (
            <Button size="sm" variant="outline" onClick={() => onMarkAsRead(notification.id)}>
              Marquer comme lue
            </Button>
          )}
          {onDetail && (
            <Button size="sm" variant="secondary" onClick={() => onDetail(notification)}>
              Voir le détail
            </Button>
          )}
          {onDelete && (
            <Button size="icon" variant="ghost" onClick={() => onDelete(notification.id)} aria-label="Supprimer">
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 