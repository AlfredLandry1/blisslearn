"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { useEffect, useRef } from "react";
import { useUIStore } from "@/stores/uiStore";
import { toast } from "sonner";

function NotificationsListener() {
  const notifications = useUIStore((s) => s.notifications);
  const removeNotification = useUIStore((s) => s.removeNotification);
  const displayed = useRef<Set<string>>(new Set());

  useEffect(() => {
    notifications.forEach((notif) => {
      if (!displayed.current.has(notif.id)) {
        // Affiche le toast selon le type
        switch (notif.type) {
          case "success":
            toast.success(notif.title || "Succès", { description: notif.message, duration: notif.duration });
            break;
          case "error":
            toast.error(notif.title || "Erreur", { description: notif.message, duration: notif.duration });
            break;
          case "warning":
            toast.warning(notif.title || "Attention", { description: notif.message, duration: notif.duration });
            break;
          case "info":
          default:
            toast.info(notif.title || "Info", { description: notif.message, duration: notif.duration });
            break;
        }
        displayed.current.add(notif.id);
      }
    });
  }, [notifications, removeNotification]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <NotificationsListener />
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
} 