"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorDisplayProps {
  errorKey: string;
  className?: string;
  showIcon?: boolean;
  variant?: "inline" | "toast" | "banner";
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errorKey,
  className = "",
  showIcon = true,
  variant = "inline"
}) => {
  const { getError, clearError, hasError } = useUIStore();
  const error = getError(errorKey);
  const hasErrorMessage = hasError(errorKey);

  if (!hasErrorMessage) return null;

  const handleDismiss = () => {
    clearError(errorKey);
  };

  const baseClasses = "flex items-center gap-2 text-red-400 text-sm";
  
  switch (variant) {
    case "toast":
      return (
        <AnimatePresence>
          {hasErrorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${baseClasses} bg-red-900/20 border border-red-500/30 rounded-lg p-3 ${className}`}
            >
              {showIcon && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              <span className="flex-1">{error}</span>
              <button
                onClick={handleDismiss}
                className="text-red-300 hover:text-red-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      );

    case "banner":
      return (
        <AnimatePresence>
          {hasErrorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`${baseClasses} bg-red-900/20 border-b border-red-500/30 p-4 ${className}`}
            >
              {showIcon && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
              <span className="flex-1 font-medium">{error}</span>
              <button
                onClick={handleDismiss}
                className="text-red-300 hover:text-red-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      );

    default: // inline
      return (
        <div className={`${baseClasses} ${className}`}>
          {showIcon && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          <span>{error}</span>
        </div>
      );
  }
};

// Hook utilitaire pour gérer les erreurs
export const useErrorHandler = (errorKey: string) => {
  const { setError, clearError, getError, hasError } = useUIStore();

  return {
    setError: (message: string) => setError(errorKey, message),
    clearError: () => clearError(errorKey),
    getError: () => getError(errorKey),
    hasError: () => hasError(errorKey),
    ErrorDisplay: (props: Omit<ErrorDisplayProps, "errorKey">) => (
      <ErrorDisplay errorKey={errorKey} {...props} />
    )
  };
}; 