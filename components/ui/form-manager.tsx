"use client";

import React from "react";
import { useUIStore } from "@/stores/uiStore";

// Hook utilitaire pour gérer les formulaires - SIMPLIFIÉ
export const useFormManager = (formKey: string) => {
  const { 
    formData, 
    setFormData, 
    updateFormData, 
    clearFormData, 
    getFormData,
    setLoading,
    clearLoading,
    setError,
    clearError
  } = useUIStore();

  // ✅ SIMPLIFIÉ : Utiliser directement les données du store
  const form = formData[formKey] || {};

  return {
    // Données du formulaire
    form,
    
    // Actions
    setForm: (data: any) => setFormData(formKey, data),
    updateField: (field: string, value: any) => updateFormData(formKey, field, value),
    clearForm: () => clearFormData(formKey),
    
    // Getters pour les champs spécifiques
    getField: (field: string) => form[field],
    
    // Validation et utilitaires
    hasField: (field: string) => field in form,
    isEmpty: () => Object.keys(form).length === 0,
    
    // Actions de soumission avec gestion d'état
    submitForm: async (
      submitFn: (data: any) => Promise<any>,
      options?: {
        onSuccess?: (result: any) => void;
        onError?: (error: any) => void;
        loadingKey?: string;
        errorKey?: string;
      }
    ) => {
      const { onSuccess, onError, loadingKey, errorKey } = options || {};
      
      if (loadingKey) {
        setLoading(loadingKey, true);
      }
      if (errorKey) {
        clearError(errorKey);
      }

      try {
        const result = await submitFn(form);
        if (onSuccess) onSuccess(result);
        return result;
      } catch (error) {
        if (onError) onError(error);
        if (errorKey) {
          setError(errorKey, error instanceof Error ? error.message : "Une erreur est survenue");
        }
        throw error;
      } finally {
        if (loadingKey) {
          clearLoading(loadingKey);
        }
      }
    }
  };
};

// Composant de champ de formulaire avec gestion automatique - SIMPLIFIÉ
interface FormFieldProps {
  formKey: string;
  field: string;
  children: (props: {
    value: any;
    onChange: (value: any) => void;
    error?: string;
  }) => React.ReactNode;
  errorKey?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  formKey,
  field,
  children,
  errorKey
}) => {
  const { updateField } = useFormManager(formKey);
  const { errors } = useUIStore();
  
  // ✅ SIMPLIFIÉ : Utiliser directement les données du store
  const value = useUIStore((state) => state.formData[formKey]?.[field]);
  const error = errorKey ? errors[errorKey] : undefined;

  const handleChange = (newValue: any) => {
    updateField(field, newValue);
  };

  return (
    <>
      {children({
        value,
        onChange: handleChange,
        error
      })}
    </>
  );
};

// Composant de formulaire avec gestion automatique - SIMPLIFIÉ
interface FormProps {
  formKey: string;
  children: React.ReactNode;
  onSubmit?: (data: any) => Promise<any>;
  loadingKey?: string;
  errorKey?: string;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  formKey,
  children,
  onSubmit,
  loadingKey,
  errorKey,
  className = ""
}) => {
  const { submitForm } = useFormManager(formKey);
  
  // ✅ SIMPLIFIÉ : Utiliser directement les données du store
  const loading = loadingKey ? useUIStore((state) => state.loadingStates[loadingKey] || false) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await submitForm(onSubmit, { loadingKey, errorKey });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

// Hook pour la validation de formulaires - SIMPLIFIÉ
export const useFormValidation = (formKey: string, validationSchema?: any) => {
  const { formData, setError, clearError } = useUIStore();
  
  // ✅ SIMPLIFIÉ : Utiliser directement les données du store
  const form = formData[formKey] || {};

  const validateField = (field: string, value: any) => {
    if (!validationSchema || !validationSchema[field]) return true;
    
    try {
      validationSchema[field].validateSync(value);
      clearError(`${formKey}-${field}-error`);
      return true;
    } catch (error: any) {
      setError(`${formKey}-${field}-error`, error.message);
      return false;
    }
  };

  const validateForm = () => {
    if (!validationSchema) return true;
    
    let isValid = true;
    Object.keys(validationSchema).forEach(field => {
      if (!validateField(field, form[field])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const getFieldError = (field: string) => {
    return useUIStore.getState().getError(`${formKey}-${field}-error`);
  };

  return {
    validateField,
    validateForm,
    getFieldError,
    isValid: validateForm
  };
}; 