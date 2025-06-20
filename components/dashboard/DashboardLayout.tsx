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
      {/* Sidebar mobile */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700">
            {/* Bouton de fermeture mobile en overlay */}
            <button
              className="absolute top-3 right-3 z-50 p-2 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Fermer la navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <DashboardSidebar mobile />
          </div>
        </div>
      )}
      <div className="flex flex-1">
        <div className="sticky top-0 h-[100dvh] hidden lg:block z-20">
          <DashboardSidebar />
        </div>
        <main className="flex-1">
          <div className="p-6 lg:p-8">
            <DashboardBreadcrumb />
            {children}
          </div>
        </main>
      </div>
      <BlissChatbot />
    </div>
  );
}
