"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmationProvider } from "@/components/ui/confirmation-dialog";
import { useEffect, useRef } from "react";
import { useUIStore } from "@/stores/uiStore";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
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

function AuthSyncListener() {
  const { data: session, status } = useSession();
  const { setSession, setLoading } = useUserStore();

  useEffect(() => {
    // Synchroniser la session avec le store utilisateur
    setSession(session);
    setLoading(status === 'loading');
  }, [session, status, setSession, setLoading]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ConfirmationProvider>
          <AuthSyncListener />
          {children}
          <NotificationsListener />
          <Toaster />
        </ConfirmationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 