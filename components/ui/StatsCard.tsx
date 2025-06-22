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
  <div className={clsx("bg-gray-900/60 border border-gray-700 rounded-lg p-6 flex flex-col gap-2", className)}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-6xl font-bold text-white">{value}</p>
      </div>
      {icon && <span className={clsx("w-8 h-8", color)}>{icon}</span>}
    </div>
    {children}
  </div>
); 