"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  BookOpen,
  Trophy,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Target,
  Calendar,
  BarChart3,
  Bell,
  Maximize,
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
    label: "Mes cours",
    href: "/dashboard/courses",
    icon: BookOpen,
    badge: "3",
  },
  { label: "Mon parcours", href: "/dashboard/progress", icon: Target },
  { label: "Certifications", href: "/dashboard/certifications", icon: Trophy },
  { label: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
  { label: "Statistiques", href: "/dashboard/stats", icon: BarChart3 },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: "2",
  },
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ mobile = false }: { mobile?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isForcedOpen, setIsForcedOpen] = useState<null | boolean>(null);
  const unreadCount = useUIStore((s) => s.notifications.filter((n: any) => !n.read).length);

  const expanded =
    mobile ? true : (isForcedOpen === true || (isForcedOpen === null && isHovered === true));
  const collapsed = !expanded;

  const handleToggle = () => {
    if (isForcedOpen === true || isForcedOpen === false) {
      setIsForcedOpen(null);
    } else {
      setIsForcedOpen(true);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const SidebarContent = ({ expanded }: { expanded: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Bouton de réduction (header minimal) */}
      {!mobile && (
        <div className="p-4 border-b border-gray-700 flex items-center justify-end">
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const isNotif = item.label === "Notifications";
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full relative",
                expanded ? "justify-start" : "justify-center",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              )}
              onClick={() => router.push(item.href)}
            >
              <item.icon className={cn("w-5 h-5", expanded ? "mr-3" : "mx-auto")}/>
              {expanded && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isNotif && unreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs bg-blue-500 text-white border-blue-500/80 px-1.5 py-0.5 min-w-[1.2em] h-[1.2em] flex items-center justify-center rounded-full"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </>
              )}
              {!expanded && isNotif && unreadCount > 0 && (
                <span className="absolute top-1 right-1">
                  <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white border-blue-500/80 px-1.5 py-0.5 text-xs min-w-[1.2em] h-[1.2em] flex items-center justify-center rounded-full"
                  >
                    {unreadCount}
                  </Badge>
                </span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-gray-400 hover:text-white hover:bg-gray-800/50",
            expanded ? "justify-start" : "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("w-5 h-5", expanded ? "mr-3" : "mx-auto")} />
          {expanded && <span>Se déconnecter</span>}
        </Button>
      </div>
    </div>
  );

  if (mobile) {
    // Version mobile : sidebar toujours élargie
    return (
      <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700 w-64">
        <SidebarContent expanded={true} />
      </div>
    );
  }

  // Version desktop auto-réductible
  return (
    <div
      className={cn(
        "hidden lg:flex flex-col h-screen bg-gray-900 border-r border-gray-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      onMouseEnter={() => {
        if (isForcedOpen !== false) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (isForcedOpen !== false) setIsHovered(false);
      }}
    >
      <SidebarContent expanded={expanded} />
    </div>
  );
}
