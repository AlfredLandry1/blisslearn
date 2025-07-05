"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-gray-400", className)}
    >
      <ol className="flex items-center space-x-1">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-white transition-colors"
            aria-label="Accueil"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-gray-500" />
            {item.current ? (
              <span
                className="text-white font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-400">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Hook pour générer automatiquement les breadcrumbs
export function useBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbMap: Record<string, string> = {
    'dashboard': 'Tableau de bord',
    'explorer': 'Explorer',
    'my-courses': 'Mes cours',
    'certifications': 'Certifications',
    'stats': 'Statistiques',
    'calendar': 'Calendrier',
    'settings': 'Paramètres',
    'notifications': 'Notifications',
    'auth': 'Authentification',
    'login': 'Connexion',
    'register': 'Inscription',
    'forgot-password': 'Mot de passe oublié',
    'reset-password': 'Réinitialiser le mot de passe',
    'verify-email': 'Vérifier l\'email',
    'onboarding': 'Configuration',
  };

  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    
    return {
      label: breadcrumbMap[segment] || segment,
      href: isLast ? undefined : href,
      current: isLast,
    };
  });
} 