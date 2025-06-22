import React from "react";
import clsx from "clsx";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, children, className }) => (
  <div className={clsx("flex items-center gap-2 text-white text-lg font-semibold p-6 pb-2", className)}>
    {icon && <span className="w-5 h-5 text-primary">{icon}</span>}
    <span>{children}</span>
  </div>
); 