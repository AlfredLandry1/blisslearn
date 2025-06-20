import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotificationDetailModalProps {
  open: boolean;
  onClose: () => void;
  notification: any | null;
  getNotificationIcon: (type: string) => React.ElementType;
  getNotificationColor: (type: string) => string;
  onMarkAsRead?: (id: string) => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  open,
  onClose,
  notification,
  getNotificationIcon,
  getNotificationColor,
  onMarkAsRead,
}) => {
  if (!notification) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md w-full rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl p-8">
          <div className="text-gray-400">Aucune notification sélectionnée.</div>
        </DialogContent>
      </Dialog>
    );
  }
  const NotificationIcon = getNotificationIcon(notification.type);
  const isRead = Boolean((notification as any).read);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl p-8">
        <DialogTitle className="sr-only">Détail de la notification</DialogTitle>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center`}>
            {React.createElement(NotificationIcon as any, { className: "w-6 h-6" })}
            </div>
            <div>
              <div className="font-bold text-lg text-white">{notification.title}</div>
              <div className="text-xs text-gray-400 mt-1">
                {notification.type && (
                  <span className="capitalize mr-2">{notification.type}</span>
                )}
                {isRead ? (
                  <span className="inline-block bg-gray-700 text-gray-300 rounded px-2 py-0.5 text-xs ml-1">Lue</span>
                ) : (
                  <span className="inline-block bg-blue-500/20 text-blue-400 rounded px-2 py-0.5 text-xs ml-1">Non lue</span>
                )}
                {(notification as any).date && (
                  <span className="ml-2">{formatDate((notification as any).date)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-gray-200 text-base whitespace-pre-line">{notification.message}</div>
          {!isRead && onMarkAsRead && (
            <Button variant="outline" size="sm" onClick={() => onMarkAsRead(notification.id)}>
              Marquer comme lue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 