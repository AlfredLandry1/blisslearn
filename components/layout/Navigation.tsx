"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  BookOpen,
  Target,
  Trophy,
  BarChart3,
  Bell,
  Calendar,
  Home,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

const navigationItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Explorer", href: "/dashboard/explorer", icon: BookOpen },
  { name: "Mes Cours", href: "/dashboard/my-courses", icon: Target },
  { name: "Certifications", href: "/dashboard/certifications", icon: Trophy },
  { name: "Statistiques", href: "/dashboard/stats", icon: BarChart3 },
  { name: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
];

export function Navigation() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadCount = useUIStore((s) => s.notifications.filter((n: any) => !n.read).length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
              BlissLearn
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {status === "authenticated" ? (
              <>
                {/* Notifications */}
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Menu utilisateur */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gray-900 border-l border-gray-700">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center space-x-2">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    <span>Menu</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-6">
                  {/* Navigation Mobile */}
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Actions Mobile */}
                  {status === "authenticated" ? (
                    <div className="space-y-4 pt-6 border-t border-gray-700">
                      {/* Notifications */}
                      <Link
                        href="/dashboard/notifications"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5" />
                          <span className="font-medium">Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>

                      {/* Profil utilisateur */}
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{session?.user?.name}</p>
                            <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions utilisateur */}
                      <div className="space-y-2">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          <span>Paramètres</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-6 border-t border-gray-700">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button variant="outline" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          S'inscrire
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
} 