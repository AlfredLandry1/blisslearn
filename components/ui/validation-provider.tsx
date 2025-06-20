"use client";

import React, { createContext, useContext, useState } from "react";

interface ValidationContextType {
  errors: Record<string, string>;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

interface ValidationProviderProps {
  children: React.ReactNode;
}

export function ValidationProvider({ children }: ValidationProviderProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <ValidationContext.Provider
      value={{
        errors,
        setError,
        clearError,
        clearAllErrors,
        hasErrors,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return context;
}

interface ValidationMessageProps {
  field: string;
  className?: string;
}

export function ValidationMessage({ field, className }: ValidationMessageProps) {
  const { errors } = useValidation();
  const error = errors[field];

  if (!error) return null;

  return (
    <div
      className={className}
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );
}