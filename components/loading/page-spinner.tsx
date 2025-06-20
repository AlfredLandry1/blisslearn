import { cn } from "@/lib/utils";

interface PageSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PageSpinner({ className, size = "md" }: PageSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div
        className={cn(
          "animate-spin rounded-full border-t-primary",
          "border-l-transparent border-r-transparent border-b-muted",
          sizeClasses[size],
          className
        )}
      />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Chargement...
      </p>
    </div>
  );
} 