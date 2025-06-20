import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonSpinnerProps {
  className?: string;
  variant?: "default" | "primary" | "secondary" | "ghost" | "destructive";
}

export function ButtonSpinner({
  className, variant = "default", }: ButtonSpinnerProps) {
  const variantClasses = {
    default: "text-white",
    primary: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    ghost: "text-foreground",
    destructive: "text-destructive-foreground",
  };

  return (
    <Loader2
      className={cn(
        "h-4 w-4 animate-spin",
        variantClasses[variant],
        className
      )}
    />
  );
} 