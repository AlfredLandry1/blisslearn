"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Réinitialiser l'état quand la source change
  React.useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  // Vérifier si c'est une image Google qui pourrait causer des erreurs 429
  const isGoogleImage = typeof src === "string" && src.includes('googleusercontent.com');
  
  // Si c'est une image Google et qu'il y a eu une erreur, ne pas réessayer
  if (isGoogleImage && imageError) {
    return null; // Retourner null pour déclencher le fallback
  }

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full transition-opacity duration-200",
        isLoading ? "opacity-0" : "opacity-100",
        className
      )}
      src={src}
      alt={alt}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setImageError(true);
        setIsLoading(false);
        console.warn("Erreur de chargement d'image:", src);
      }}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
