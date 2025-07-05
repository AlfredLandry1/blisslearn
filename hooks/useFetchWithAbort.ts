import { useCallback, useRef } from 'react';
import { fetchWithTimeout } from '@/lib/utils';

interface UseFetchWithAbortOptions {
  timeoutMs?: number;
  onAbort?: () => void;
  onError?: (error: Error) => void;
}

export function useFetchWithAbort(options: UseFetchWithAbortOptions = {}) {
  const { timeoutMs = 10000, onAbort, onError } = options;
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (
    url: string, 
    fetchOptions: RequestInit = {}
  ): Promise<Response> => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Créer un nouveau contrôleur
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetchWithTimeout(
        url, 
        { ...fetchOptions, signal: abortControllerRef.current.signal },
        timeoutMs
      );
      
      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Requête annulée (timeout ou navigation)') {
          console.log('🔄 Requête annulée normalement');
          onAbort?.();
        } else {
          console.error('❌ Erreur de requête:', error);
          onError?.(error);
        }
      }
      throw error;
    }
  }, [timeoutMs, onAbort, onError]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    fetchData,
    abort,
    isAborted: () => abortControllerRef.current?.signal.aborted || false
  };
} 