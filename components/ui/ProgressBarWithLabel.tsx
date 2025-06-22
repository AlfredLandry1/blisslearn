import React from "react";
import { Progress } from "@/components/ui/progress";
import clsx from "clsx";

interface ProgressBarWithLabelProps {
  value: number;
  label?: string;
  className?: string;
}

export const ProgressBarWithLabel: React.FC<ProgressBarWithLabelProps> = ({ value, label, className }) => (
  <div className={clsx("space-y-1", className)}>
    {label && (
      <div className="flex justify-between text-sm text-gray-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
    )}
    <Progress value={value} className="h-3" />
  </div>
); 