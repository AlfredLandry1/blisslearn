"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Settings, Sparkles, Menu, X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader({
  onMobileMenu,
  isMobileOpen,
}: {
  onMobileMenu?: () => void;
  isMobileOpen?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const unreadCount = useUIStore(
    (s) => s.notifications.filter((n: any) => !n.read).length
  );

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-gray-950/80 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
        {/* Logo + bouton mobile */}
        <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
          {/* Bouton hamburger mobile */}
          {onMobileMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-400 mr-1 sm:mr-2 block lg:hidden transition-colors duration-200"
              onClick={onMobileMenu}
              aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </Button>
          )}
          
          {/* Bouton sidebar desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-blue-400 mr-1 sm:mr-2 hidden lg:flex transition-colors duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Fermer la sidebar" : "Ouvrir la sidebar"}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          
          <div
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-white hidden sm:block">
              BlissLearn
            </span>
          </div>
        </div>

        {/* Actions - optimisé pour mobile */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {/* Notifications - visible sur mobile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              onClick={() => router.push("/dashboard/notifications")}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1">
                  <Badge className="bg-blue-500 text-white px-1 sm:px-1.5 py-0.5 text-xs min-w-[1.2em] h-[1.2em] flex items-center justify-center rounded-full border-2 border-gray-950">
                    {unreadCount}
                  </Badge>
                </span>
              )}
            </Button>
          </div>

          {/* Paramètres - caché sur très petit écran */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-blue-400 hidden sm:flex transition-colors duration-200"
            onClick={() => router.push("/dashboard/settings")}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Déconnexion - caché sur très petit écran */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-400 hidden sm:flex transition-colors duration-200"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Avatar et nom utilisateur */}
          <div className="ml-1 sm:ml-2 flex items-center space-x-2">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-blue-500">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm sm:text-lg">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-white font-medium max-w-[120px] truncate">
              {session?.user?.name || "Utilisateur"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
