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
  Trophy,
  Settings,
  LogOut,
  Target,
  Calendar,
  BarChart3,
  Bell,
  Maximize,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/stores/uiStore";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: Home },
  {
    label: "Explorer les cours",
    href: "/dashboard/explorer",
    icon: BookOpen,
  },
  {
    label: "Mes cours suivis",
    href: "/dashboard/my-courses",
    icon: Target,
  },
  { label: "Certifications", href: "/dashboard/certifications", icon: Trophy },
  { label: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
  { label: "Statistiques", href: "/dashboard/stats", icon: BarChart3 },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ mobile = false }: { mobile?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const unreadCount = useUIStore(
    (s) => s.notifications.filter((n: any) => !n.read).length
  );

  const expanded = mobile ? true : sidebarOpen;
  const collapsed = !expanded;

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
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {expanded && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">BlissLearn</span>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="text-gray-400 hover:text-white"
              >
                <Maximize
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expanded && "rotate-180"
                  )}
                />
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
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
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
      </nav>

      {/* Footer avec déconnexion */}
      <div className="p-4 border-t border-gray-700">
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
        "hidden lg:flex flex-col h-screen bg-gray-900 border-r border-gray-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent expanded={expanded} />
    </div>
  );
}
