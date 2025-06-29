import React from "react";
import clsx from "clsx";

interface StatsCardProps {
  icon?: React.ReactNode;
  title: string;
  value: React.ReactNode;
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, color = "text-primary", children, className }) => (
  <div className={clsx("bg-gray-900/60 border border-gray-700 rounded-lg p-6 flex flex-col gap-2 overflow-hidden min-w-0", className)}>
    <div className="flex items-center justify-between min-w-0 w-full">
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-sm text-gray-400 truncate overflow-hidden">{title}</p>
        <p className="text-6xl font-bold text-white truncate overflow-hidden">{value}</p>
      </div>
      {icon && <span className={clsx("w-8 h-8 flex-shrink-0 min-w-0", color)}>{icon}</span>}
    </div>
    <div className="overflow-hidden min-w-0">
      {children}
    </div>
  </div>
); 