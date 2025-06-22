"use client";

import React from "react";
import { useUIStore } from "@/stores/uiStore";

// Hook utilitaire pour gérer les formulaires
export const useFormManager = (formKey: string) => {
  const { 
    formData, 
    setFormData, 
    updateFormData, 
    clearFormData, 
    getFormData 
  } = useUIStore();

  const form = getFormData(formKey);

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
        useUIStore.getState().setLoading(loadingKey, true);
      }
      if (errorKey) {
        useUIStore.getState().clearError(errorKey);
      }

      try {
        const result = await submitFn(form);
        if (onSuccess) onSuccess(result);
        return result;
      } catch (error) {
        if (onError) onError(error);
        if (errorKey) {
          useUIStore.getState().setError(errorKey, error instanceof Error ? error.message : "Une erreur est survenue");
        }
        throw error;
      } finally {
        if (loadingKey) {
          useUIStore.getState().setLoading(loadingKey, false);
        }
      }
    }
  };
};

// Composant de champ de formulaire avec gestion automatique
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
  const { getField, updateField } = useFormManager(formKey);
  const { getError } = useUIStore();
  
  const value = getField(field);
  const error = errorKey ? getError(errorKey) || undefined : undefined;

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

// Composant de formulaire avec gestion automatique
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
  const { form, submitForm } = useFormManager(formKey);
  const { isLoading } = useUIStore();
  
  const loading = loadingKey ? isLoading(loadingKey) : false;

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

// Hook pour la validation de formulaires
export const useFormValidation = (formKey: string, validationSchema?: any) => {
  const { form } = useFormManager(formKey);
  const { setError, clearError } = useUIStore();

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