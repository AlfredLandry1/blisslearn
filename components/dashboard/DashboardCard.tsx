"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

export function DashboardCard({ 
  title, 
  children, 
  className = "",
  headerAction,
  footer 
}: DashboardCardProps) {
  return (
    <Card className={`overflow-hidden min-w-0 ${className}`}>
      <CardHeader className="overflow-hidden min-w-0">
        <div className="flex items-center justify-between min-w-0 w-full">
          <CardTitle className="text-white text-lg font-bold truncate flex-1 min-w-0 overflow-hidden">
            {title}
          </CardTitle>
          {headerAction && (
            <div className="flex-shrink-0 ml-2 min-w-0">
              {headerAction}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-hidden min-w-0">
        {children}
      </CardContent>
      
      {footer && (
        <div className="px-6 pb-6 -mb-2 overflow-hidden min-w-0">
          {footer}
        </div>
      )}
    </Card>
  );
} 