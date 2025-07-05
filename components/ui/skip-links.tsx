"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SkipLink {
  id: string;
  label: string;
  href: string;
}

interface SkipLinksProps {
  links: SkipLink[];
  className?: string;
}

export function SkipLinks({ links, className }: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-4 z-[9999] flex flex-col space-y-2",
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 hover:bg-blue-700"
          onClick={() => {
            const element = document.getElementById(link.id);
            if (element) {
              element.focus();
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// Skip links par défaut pour l'application
export const defaultSkipLinks: SkipLink[] = [
  {
    id: 'main-content',
    label: 'Aller au contenu principal',
    href: '#main-content'
  },
  {
    id: 'navigation',
    label: 'Aller à la navigation',
    href: '#navigation'
  },
  {
    id: 'footer',
    label: 'Aller au pied de page',
    href: '#footer'
  }
]; 