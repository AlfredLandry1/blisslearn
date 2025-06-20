import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary" | "ghost";
  label?: string;
}

export function Spinner({
  className, size = "md", variant = "default", label, }: SpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    ghost: "text-background",
  };

  return (
    <div className="flex items-center gap-2">
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      />
      {label && (
        <span
          className={cn(
            "text-sm font-medium",
            variantClasses[variant]
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
} 