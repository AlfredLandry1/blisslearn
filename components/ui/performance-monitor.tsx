"use client";

import { useEffect } from "react";
import { sendPerformanceMetrics } from "./analytics";

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Fonction pour envoyer les métriques
    const sendMetrics = (metrics: Partial<PerformanceMetrics>) => {
      // En production, envoyer vers Google Analytics
      if (process.env.NODE_ENV === 'production') {
        sendPerformanceMetrics(metrics);
      } else {
        // En développement, log les métriques
        console.log('Performance Metrics:', metrics);
      }
    };

    // Mesurer First Contentful Paint (FCP)
    const measureFCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            sendMetrics({ fcp: entry.startTime });
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
    };

    // Mesurer Largest Contentful Paint (LCP)
    const measureLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        sendMetrics({ lcp: lastEntry.startTime });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // Mesurer First Input Delay (FID)
    const measureFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const firstInputEntry = entry as PerformanceEventTiming;
          sendMetrics({ fid: firstInputEntry.processingStart - firstInputEntry.startTime });
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    };

    // Mesurer Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });

      // Envoyer CLS à la fin de la session
      window.addEventListener('beforeunload', () => {
        sendMetrics({ cls: clsValue });
      });
    };

    // Mesurer Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        sendMetrics({ ttfb: navigation.responseStart - navigation.requestStart });
      }
    };

    // Démarrer les mesures
    if ('PerformanceObserver' in window) {
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureTTFB();
    }
  }, []);

  return null; // Ce composant ne rend rien
} 