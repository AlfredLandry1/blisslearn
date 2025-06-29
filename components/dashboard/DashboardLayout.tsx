"use client";

import { ReactNode, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { DashboardHeader } from "./DashboardHeader";
import { BlissChatbot } from "@/components/ui/chat-widget/BlissChatbot";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <DashboardHeader
        onMobileMenu={() => setIsMobileOpen((v) => !v)}
        isMobileOpen={isMobileOpen}
      />

      {/* Sidebar mobile avec overlay amélioré */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-72 sm:w-80 bg-gray-900 border-r border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Bouton de fermeture mobile amélioré */}
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Fermer la navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <DashboardSidebar mobile />
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar desktop - optimisé pour différentes tailles d'écran */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Contenu principal avec padding responsive */}
        <main className="flex-1 w-full min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
            <DashboardBreadcrumb />
            <div className="mt-4 sm:mt-6 lg:mt-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      <BlissChatbot />
    </div>
  );
}
