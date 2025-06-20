"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const breadcrumbMap: Record<string, string> = {
  dashboard: "Tableau de bord",
  courses: "Mes cours",
  progress: "Mon parcours",
  certifications: "Certifications",
  calendar: "Calendrier",
  stats: "Statistiques",
  notifications: "Notifications",
  settings: "Paramètres",
  profile: "Profil",
  onboarding: "Onboarding",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return [];
    
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isActive: isLast,
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-400 mb-6">
      <a
        href="/dashboard"
        className="flex items-center hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
      </a>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          <a
            href={breadcrumb.href}
            className={cn(
              "hover:text-white transition-colors",
              breadcrumb.isActive 
                ? "text-white font-medium" 
                : "text-gray-400"
            )}
          >
            {breadcrumb.label}
          </a>
        </div>
      ))}
    </nav>
  );
} 