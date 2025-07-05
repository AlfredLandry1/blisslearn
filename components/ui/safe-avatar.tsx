"use client"

import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { cn } from "@/lib/utils";

interface SafeAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Cache local pour les images qui ont échoué
const failedImagesCache = new Set<string>();

export function SafeAvatar({ 
  src, 
  alt, 
  fallback, 
  className,
  size = "md" 
}: SafeAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'image est dans le cache des échecs
  const isFailedImage = src ? failedImagesCache.has(src) : false;

  // Réinitialiser l'état quand la source change
  useEffect(() => {
    if (src && !isFailedImage) {
      setHasError(false);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [src, isFailedImage]);

  // Gérer les erreurs d'image
  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    if (src) {
      failedImagesCache.add(src);
      console.warn("Image ajoutée au cache des échecs:", src);
    }
  };

  // Gérer le chargement réussi
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Déterminer si on doit afficher l'image
  const shouldShowImage = src && !hasError && !isFailedImage;

  // Générer le fallback à partir du nom
  const generateFallback = () => {
    if (fallback) return fallback;
    if (alt) {
      // Prendre la première lettre de chaque mot
      return alt
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  // Classes de taille
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {shouldShowImage && (
        <AvatarImage
          src={src}
          alt={alt || "Avatar"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            "transition-opacity duration-200",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium">
        {generateFallback()}
      </AvatarFallback>
    </Avatar>
  );
} 