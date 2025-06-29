"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingSpinnerProps {
  loadingKey: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loadingKey,
  size = "md",
  className = "",
  text
}) => {
  const { isKeyLoading } = useUIStore();
  const loading = isKeyLoading(loadingKey);

  if (!loading) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-400`} />
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
};

interface LoadingOverlayProps {
  loadingKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loadingKey,
  children,
  fallback,
  className = ""
}) => {
  const { isKeyLoading } = useUIStore();
  const loading = isKeyLoading(loadingKey);

  if (!loading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10"
          >
            {fallback || (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <span className="text-gray-300 text-sm">Chargement...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface LoadingButtonProps {
  loadingKey: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loadingKey,
  children,
  disabled = false,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  type = "button"
}) => {
  const { isKeyLoading } = useUIStore();
  const loading = isKeyLoading(loadingKey);

  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary"
  };

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
};

// Hook utilitaire pour gérer les états de chargement
export const useLoadingHandler = (loadingKey: string) => {
  const { setLoading, clearLoading, isKeyLoading } = useUIStore();

  return {
    setLoading: (loading: boolean) => setLoading(loadingKey, loading),
    clearLoading: () => clearLoading(loadingKey),
    isLoading: () => isKeyLoading(loadingKey),
    LoadingSpinner: (props: Omit<LoadingSpinnerProps, "loadingKey">) => (
      <LoadingSpinner loadingKey={loadingKey} {...props} />
    ),
    LoadingOverlay: (props: Omit<LoadingOverlayProps, "loadingKey">) => (
      <LoadingOverlay loadingKey={loadingKey} {...props} />
    ),
    LoadingButton: (props: Omit<LoadingButtonProps, "loadingKey">) => (
      <LoadingButton loadingKey={loadingKey} {...props} />
    )
  };
};

/**
 * Composant de chargement pour les pages entières
 */
export const PageLoadingState: React.FC<{
  message?: string;
  className?: string;
  variant?: "default" | "space" | "minimal";
}> = ({ message = "Chargement...", className = "", variant = "default" }) => {
  if (variant === "space") {
    return (
      <div className={`min-h-screen w-full relative overflow-hidden ${className}`}>
        {/* Space Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {/* Animated Logo/Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-pulse" />
                </div>
              </div>
              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white animate-pulse">
                BlissLearn
              </h2>
              <p className="text-gray-300 text-lg font-medium">
                {message}
              </p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center ${className}`}>
        <div className="flex flex-col items-center gap-6">
          {/* Minimal Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.1s' }} />
          </div>
          <p className="text-gray-300 text-lg font-medium">{message}</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-8">
        {/* Main Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-24 h-24 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          {/* Inner Ring */}
          <div className="absolute inset-2 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.1s' }} />
          {/* Center */}
          <div className="absolute inset-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Chargement
          </h2>
          <p className="text-gray-300 text-lg max-w-md">
            {message}
          </p>
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant de chargement avec skeleton pour les listes
 */
export const ListLoadingState: React.FC<{
  itemCount?: number;
  className?: string;
}> = ({ itemCount = 6, className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-24 bg-gray-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

/**
 * Composant de chargement avec skeleton pour les grilles
 */
export const GridLoadingState: React.FC<{
  itemCount?: number;
  columns?: number;
  className?: string;
}> = ({ itemCount = 8, columns = 4, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-6 ${className}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-48 bg-gray-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
}; 