"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: {
    mobile?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = {
    mobile: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    "2xl": 5
  },
  gap = {
    mobile: "gap-4",
    sm: "gap-6",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-8"
  }
}: ResponsiveGridProps) {
  const gridColsClasses = [
    `grid-cols-${cols.mobile || 1}`,
    cols.sm ? `sm:grid-cols-${cols.sm}` : "",
    cols.md ? `md:grid-cols-${cols.md}` : "",
    cols.lg ? `lg:grid-cols-${cols.lg}` : "",
    cols.xl ? `xl:grid-cols-${cols.xl}` : "",
    cols["2xl"] ? `2xl:grid-cols-${cols["2xl"]}` : ""
  ].filter(Boolean).join(" ");

  const gapClasses = [
    gap.mobile || "gap-4",
    gap.sm ? `sm:${gap.sm}` : "",
    gap.md ? `md:${gap.md}` : "",
    gap.lg ? `lg:${gap.lg}` : "",
    gap.xl ? `xl:${gap.xl}` : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={cn("grid", gridColsClasses, gapClasses, className)}>
      {children}
    </div>
  );
}

// Composants spécialisés pour différents cas d'usage
export function CourseGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      className={className}
      cols={{
        mobile: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 4,
        "2xl": 5
      }}
      gap={{
        mobile: "gap-4",
        sm: "gap-6",
        lg: "gap-8"
      }}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function FeatureGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      className={className}
      cols={{
        mobile: 1,
        sm: 2,
        lg: 3
      }}
      gap={{
        mobile: "gap-6",
        sm: "gap-8",
        lg: "gap-10"
      }}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function StatsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      className={className}
      cols={{
        mobile: 1,
        sm: 2,
        lg: 4
      }}
      gap={{
        mobile: "gap-4",
        sm: "gap-6",
        lg: "gap-8"
      }}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function DashboardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      className={className}
      cols={{
        mobile: 1,
        sm: 1,
        lg: 2,
        xl: 3
      }}
      gap={{
        mobile: "gap-4",
        sm: "gap-6",
        lg: "gap-8"
      }}
    >
      {children}
    </ResponsiveGrid>
  );
} 