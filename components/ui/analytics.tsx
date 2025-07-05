"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Configuration Google Analytics
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Charger Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Tracker les changements de page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return null;
}

// Fonction pour envoyer les métriques de performance
export function sendPerformanceMetrics(metrics: {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    Object.entries(metrics).forEach(([metric, value]) => {
      if (value !== undefined) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric,
          value: Math.round(value),
          non_interaction: true,
        });
      }
    });
  }
} 