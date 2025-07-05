import { useState, useEffect } from 'react';

interface UseAvatarOptions {
  src?: string | null;
  fallback?: string;
  enableCache?: boolean;
}

// Cache global pour les images qui ont échoué
const failedImagesCache = new Set<string>();

export function useAvatar({ src, fallback, enableCache = true }: UseAvatarOptions) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(null);
      return;
    }

    // Vérifier si l'image est dans le cache des échecs
    if (enableCache && failedImagesCache.has(src)) {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(null);
      return;
    }

    // Réinitialiser l'état
    setHasError(false);
    setIsLoading(true);
    setImageSrc(src);

    // Précharger l'image
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (enableCache) {
        failedImagesCache.add(src);
        console.warn("Image ajoutée au cache des échecs:", src);
      }
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, enableCache]);

  // Générer le fallback à partir du nom
  const generateFallback = () => {
    if (fallback) return fallback;
    return "U";
  };

  return {
    src: imageSrc,
    hasError,
    isLoading,
    shouldShowImage: !hasError && !isLoading && !!imageSrc,
    fallback: generateFallback(),
    isGoogleImage: src?.includes('googleusercontent.com') || false
  };
} 