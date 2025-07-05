"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  BookOpen,
  Target,
  Trophy,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Maximize,
  Sparkles,
  User,
  Calendar,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/uiStore";
import { SafeAvatar } from "@/components/ui/safe-avatar";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: "main" | "learning" | "analytics" | "system";
}

const sidebarItems: SidebarItem[] = [
  // Navigation principale
  { label: "Tableau de bord", href: "/dashboard", icon: Home, category: "main" },
  
  // Apprentissage
  {
    label: "Explorer les cours",
    href: "/dashboard/explorer",
    icon: BookOpen,
    category: "learning"
  },
  {
    label: "Mes cours suivis",
    href: "/dashboard/my-courses",
    icon: Target,
    category: "learning"
  },
  { label: "Certifications", href: "/dashboard/certifications", icon: Trophy, category: "learning" },
  
  // Analytics
  { label: "Calendrier", href: "/dashboard/calendar", icon: Calendar, category: "analytics" },
  { label: "Statistiques", href: "/dashboard/stats", icon: BarChart3, category: "analytics" },
  { label: "Progression", href: "/dashboard/progress", icon: TrendingUp, category: "analytics" },
  
  // Système
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    category: "system"
  },
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings, category: "system" },
];

export function DashboardSidebar({ mobile = false }: { mobile?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, unreadCount } = useUIStore();

  const expanded = mobile ? true : sidebarOpen;

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const SidebarContent = ({ expanded }: { expanded: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header avec logo et bouton de réduction */}
      {!mobile && (
        <div className={cn(
          "border-b border-gray-700 flex items-center",
          expanded ? "p-4 justify-between" : "p-2 justify-center"
        )}>
          {/* {expanded && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">BlissLearn</span>
            </div>
          )} */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="text-gray-400 hover:text-white"
              >
                {expanded ? (
                  <X className="w-4 h-4 transition-transform" />
                ) : (
                  <Maximize className="w-4 h-4 transition-transform" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {expanded
                ? "Réduire la barre latérale"
                : "Déplier la barre latérale"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Navigation principale */}
      <nav className={cn(
        "flex-1 min-h-0 overflow-y-auto space-y-6",
        expanded ? "p-4" : "p-2"
      )}>
        {/* Navigation principale */}
        <div className="space-y-1">
          {sidebarItems
            .filter(item => item.category === "main")
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full relative group transition-all duration-200",
                        expanded ? "justify-start h-10" : "justify-center h-10",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md"
                      )}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform group-hover:scale-110",
                          expanded ? "w-5 h-5 mr-3" : "w-5 h-5"
                        )}
                      />
                      {expanded && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">
                      <p className="font-medium">{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
        </div>

        {/* Apprentissage */}
        {expanded ? (
          <div className="space-y-1">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Apprentissage
            </div>
            {sidebarItems
              .filter(item => item.category === "learning")
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full relative group transition-all duration-200 justify-start h-10",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
          </div>
        ) : (
          <div className="space-y-1">
            {sidebarItems
              .filter(item => item.category === "learning")
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full relative group transition-all duration-200 justify-center h-10",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md"
                        )}
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
          </div>
        )}

        {/* Analytics */}
        {expanded ? (
          <div className="space-y-1">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Analytics
            </div>
            {sidebarItems
              .filter(item => item.category === "analytics")
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full relative group transition-all duration-200 justify-start h-10",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
          </div>
        ) : (
          <div className="space-y-1">
            {sidebarItems
              .filter(item => item.category === "analytics")
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full relative group transition-all duration-200 justify-center h-10",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md"
                        )}
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
          </div>
        )}

        {/* Système */}
        <div className="space-y-1">
          {expanded && (
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Système
            </div>
          )}
          {sidebarItems
            .filter(item => item.category === "system")
            .map((item) => {
              const isActive = pathname === item.href;
              const isNotif = item.label === "Notifications";
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full relative group transition-all duration-200",
                        expanded ? "justify-start h-10" : "justify-center h-10",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md"
                      )}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon
                        className={cn(
                          "transition-transform group-hover:scale-110",
                          expanded ? "w-5 h-5 mr-3" : "w-5 h-5"
                        )}
                      />
                      {expanded && (
                        <div className="flex items-center justify-between flex-1">
                          <span className="font-medium">{item.label}</span>
                          {isNotif && unreadCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs bg-blue-500 text-white border-blue-500/80 px-1.5 py-0.5 min-w-[1.2em] h-[1.2em] flex items-center justify-center rounded-full"
                            >
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      )}
                      {!expanded && isNotif && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1">
                          <Badge
                            variant="secondary"
                            className="bg-blue-500 text-white border-blue-500/80 px-1.5 py-0.5 text-xs min-w-[1.2em] h-[1.2em] flex items-center justify-center rounded-full"
                          >
                            {unreadCount}
                          </Badge>
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">
                      <p className="font-medium">{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
        </div>
      </nav>

      {/* Footer avec profil utilisateur et déconnexion */}
      <div className={cn(
        "border-t border-gray-700 space-y-2",
        expanded ? "p-4" : "p-2"
      )}>
        {/* Profil utilisateur */}
        {expanded && session?.user && (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/30">
            <SafeAvatar 
              src={session.user.image || ""} 
              alt={session.user.name || "Utilisateur"}
              size="sm"
              className="border-2 border-blue-500"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        
        {/* Bouton déconnexion */}
        <Button
          variant="ghost"
          className={cn(
            "w-full text-gray-400 hover:text-white hover:bg-gray-800/50",
            expanded ? "justify-start" : "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("w-5 h-5", expanded ? "mr-3" : "")} />
          {expanded && <span>Se déconnecter</span>}
        </Button>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700 w-64">
        <SidebarContent expanded={true} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-700 transition-all duration-300 z-50",
        expanded ? "w-64" : "w-16"
      )}
    >
      <SidebarContent expanded={expanded} />
    </div>
  );
}
