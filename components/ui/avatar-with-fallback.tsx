"use client"

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { useAvatar } from "@/hooks/useAvatar";
import { cn } from "@/lib/utils";

interface AvatarWithFallbackProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLoadingState?: boolean;
}

export function AvatarWithFallback({ 
  src, 
  alt, 
  fallback, 
  className,
  size = "md",
  showLoadingState = false
}: AvatarWithFallbackProps) {
  const avatar = useAvatar({ 
    src, 
    fallback: fallback || (alt ? alt.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : undefined)
  });

  // Classes de taille
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatar.shouldShowImage && (
        <AvatarImage
          src={avatar.src || ""}
          alt={alt || "Avatar"}
          className={cn(
            "transition-opacity duration-200",
            avatar.isLoading ? "opacity-50" : "opacity-100"
          )}
        />
      )}
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium">
        {showLoadingState && avatar.isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          avatar.fallback
        )}
      </AvatarFallback>
    </Avatar>
  );
} 