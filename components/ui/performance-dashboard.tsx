"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Clock, MousePointer, Layout } from "lucide-react";

interface PerformanceData {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  timestamp: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher le dashboard en développement
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    // Écouter les métriques de performance
    const handlePerformanceData = (event: CustomEvent) => {
      setMetrics(event.detail);
    };

    window.addEventListener('performance-metrics', handlePerformanceData as EventListener);

    return () => {
      window.removeEventListener('performance-metrics', handlePerformanceData as EventListener);
    };
  }, []);

  const getScore = (metric: string, value: number): { score: number; color: string; label: string } => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return { score: 0, color: 'gray', label: 'N/A' };

    if (value <= threshold.good) {
      return { score: 100, color: 'green', label: 'Excellent' };
    } else if (value <= threshold.poor) {
      return { score: 50, color: 'yellow', label: 'À améliorer' };
    } else {
      return { score: 0, color: 'red', label: 'Critique' };
    }
  };

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl backdrop-blur-sm max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Performance Monitor</h3>
        <Badge variant="outline" className="text-xs">
          Dev Mode
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-gray-300">FCP</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">{Math.round(metrics.fcp)}ms</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                getScore('fcp', metrics.fcp).color === 'green' ? 'border-green-500 text-green-400' :
                getScore('fcp', metrics.fcp).color === 'yellow' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
              }`}
            >
              {getScore('fcp', metrics.fcp).label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-purple-400" />
            <span className="text-gray-300">LCP</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">{Math.round(metrics.lcp)}ms</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                getScore('lcp', metrics.lcp).color === 'green' ? 'border-green-500 text-green-400' :
                getScore('lcp', metrics.lcp).color === 'yellow' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
              }`}
            >
              {getScore('lcp', metrics.lcp).label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <MousePointer className="w-3 h-3 text-green-400" />
            <span className="text-gray-300">FID</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">{Math.round(metrics.fid)}ms</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                getScore('fid', metrics.fid).color === 'green' ? 'border-green-500 text-green-400' :
                getScore('fid', metrics.fid).color === 'yellow' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
              }`}
            >
              {getScore('fid', metrics.fid).label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Layout className="w-3 h-3 text-orange-400" />
            <span className="text-gray-300">CLS</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">{metrics.cls.toFixed(3)}</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                getScore('cls', metrics.cls).color === 'green' ? 'border-green-500 text-green-400' :
                getScore('cls', metrics.cls).color === 'yellow' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
              }`}
            >
              {getScore('cls', metrics.cls).label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="text-gray-300">TTFB</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">{Math.round(metrics.ttfb)}ms</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                getScore('ttfb', metrics.ttfb).color === 'green' ? 'border-green-500 text-green-400' :
                getScore('ttfb', metrics.ttfb).color === 'yellow' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
              }`}
            >
              {getScore('ttfb', metrics.ttfb).label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Dernière mise à jour: {new Date(metrics.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
} 