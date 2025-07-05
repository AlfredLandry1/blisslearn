import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient, authenticatedApiClient } from '@/lib/api-client';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

interface UseApiClientOptions {
  authenticated?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApiClient<T = any>(options: UseApiClientOptions = {}) {
  const { authenticated = false, onSuccess, onError, onFinally } = options;
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const client = authenticated ? authenticatedApiClient : apiClient;
  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ CORRIGÉ : Callbacks stables avec useRef pour éviter les boucles
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onFinallyRef = useRef(onFinally);

  // Mettre à jour les refs quand les callbacks changent
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onFinallyRef.current = onFinally;
  }, [onFinally]);

  // ✅ CORRIGÉ : Fonction générique stable avec meilleure gestion des erreurs
  const executeRequest = useCallback(async (
    requestFn: () => Promise<ApiResponse<T>>
  ) => {
    // Annuler la requête précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Créer un nouveau contrôleur
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await requestFn();
      setState({ data: response.data, loading: false, error: null });
      onSuccessRef.current?.(response.data);
      return response;
    } catch (error) {
      const apiError = error as Error;
      
      // ✅ AMÉLIORÉ : Ne pas traiter les erreurs d'annulation comme des erreurs réelles
      if (apiError.name === 'AbortError' || apiError.message.includes('annulée')) {
        // Requête annulée intentionnellement, ne pas afficher d'erreur
        setState(prev => ({ ...prev, loading: false, error: null }));
        return;
      }
      
      setState(prev => ({ ...prev, loading: false, error: apiError }));
      onErrorRef.current?.(apiError);
      throw apiError;
    } finally {
      onFinallyRef.current?.();
    }
  }, []); // ✅ Dépendances vides car on utilise des refs

  // ✅ CORRIGÉ : Méthodes HTTP stables
  const get = useCallback(async (url: string, options: RequestInit = {}) => {
    return executeRequest(() => client.get<T>(url, options));
  }, [executeRequest, client]);

  const post = useCallback(async (url: string, data?: any, options: RequestInit = {}) => {
    return executeRequest(() => client.post<T>(url, data, options));
  }, [executeRequest, client]);

  const put = useCallback(async (url: string, data?: any, options: RequestInit = {}) => {
    return executeRequest(() => client.put<T>(url, data, options));
  }, [executeRequest, client]);

  const patch = useCallback(async (url: string, data?: any, options: RequestInit = {}) => {
    return executeRequest(() => client.patch<T>(url, data, options));
  }, [executeRequest, client]);

  const del = useCallback(async (url: string, options: RequestInit = {}) => {
    return executeRequest(() => client.delete<T>(url, options));
  }, [executeRequest, client]);

  // Annuler la requête en cours
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Reset l'état
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // ✅ CORRIGÉ : Nettoyage automatique
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // État
    ...state,
    
    // Méthodes HTTP
    get,
    post,
    put,
    patch,
    delete: del,
    
    // Utilitaires
    cancel,
    reset,
    
    // Client brut pour les cas avancés
    client
  };
}

// ✅ CORRIGÉ : Hook spécialisé avec dépendances stables
export function useApiData<T = any>(
  url: string,
  options: UseApiClientOptions & { 
    immediate?: boolean;
    dependencies?: any[];
  } = {}
) {
  const { immediate = true, dependencies = [], ...apiOptions } = options;
  const api = useApiClient<T>(apiOptions);

  // ✅ CORRIGÉ : fetchData stable
  const fetchData = useCallback(async () => {
    try {
      await api.get(url);
    } catch (error) {
      // Erreur déjà gérée par useApiClient
    }
  }, [api.get, url]); // ✅ Dépendances spécifiques

  // ✅ CORRIGÉ : useEffect avec dépendances stables
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData, ...dependencies]);

  return {
    ...api,
    refetch: fetchData
  };
} 