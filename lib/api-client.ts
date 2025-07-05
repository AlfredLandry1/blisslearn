// Client API robuste basé sur Fetch natif
// Équivalent aux fonctionnalités d'Axios mais sans dépendance externe

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

// Cette interface TypeScript définit la structure standard de la réponse d'une requête API.
// Elle est générique (T = any), ce qui signifie que le type de la donnée retournée ("data") peut être précisé lors de l'utilisation.
// Les propriétés incluent :
// - data : le contenu de la réponse (de type T)
// - status : le code HTTP de la réponse (ex : 200, 404, etc.)
// - statusText : le texte associé au code HTTP (ex : "OK", "Not Found")
// - headers : les en-têtes HTTP de la réponse (objet Headers)
// - ok : booléen indiquant si la requête a réussi (true si le code HTTP est dans la plage 200-299)
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  config?: any;
}

class ApiClient {
  private config: Required<ApiClientConfig>;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      withCredentials: config.withCredentials || false
    };
  }

  // Méthode générique pour les requêtes
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.config.baseURL}${url}`;
    const controller = new AbortController();
    const requestId = `${options.method || 'GET'}_${fullUrl}`;
    
    // Stocker le contrôleur pour pouvoir l'annuler
    this.abortControllers.set(requestId, controller);

    const timeoutId = setTimeout(() => {
      controller.abort();
      this.abortControllers.delete(requestId);
    }, this.config.timeout);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...this.config.headers,
          ...options.headers
        },
        credentials: this.config.withCredentials ? 'include' : 'same-origin',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);

      // Gestion automatique des erreurs HTTP
      if (!response.ok) {
        const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.config = { url: fullUrl, ...options };
        
        // ✅ CORRIGÉ : Lire le body une seule fois
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          try {
            error.data = await response.json();
          } catch {
            error.data = null;
          }
        } else {
          try {
            error.data = await response.text();
          } catch {
            error.data = null;
          }
        }
        
        throw error;
      }

      // Parser automatiquement la réponse JSON
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok
      };

    } catch (error) {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);

      if (error instanceof Error && error.name === 'AbortError') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Requête annulée:', fullUrl);
        }
        const abortError: ApiError = new Error('Requête annulée (timeout ou navigation)');
        abortError.name = 'AbortError';
        throw abortError;
      }

      throw error;
    }
  }

  // Méthodes HTTP
  async get<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(url: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async patch<T>(url: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  // Annuler une requête spécifique
  cancel(url: string, method: string = 'GET'): boolean {
    const requestId = `${method}_${this.config.baseURL}${url}`;
    const controller = this.abortControllers.get(requestId);
    
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
      return true;
    }
    
    return false;
  }

  // Annuler toutes les requêtes
  cancelAll(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }

  // Mettre à jour la configuration
  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Intercepteurs (simulation)
  private requestInterceptors: Array<(config: any) => any> = [];
  private responseInterceptors: Array<(response: any) => any> = [];
  private errorInterceptors: Array<(error: any) => any> = [];

  // Ajouter un intercepteur de requête
  addRequestInterceptor(interceptor: (config: any) => any): void {
    this.requestInterceptors.push(interceptor);
  }

  // Ajouter un intercepteur de réponse
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }

  // Ajouter un intercepteur d'erreur
  addErrorInterceptor(interceptor: (error: any) => any): void {
    this.errorInterceptors.push(interceptor);
  }
}

// Instance par défaut
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000 // ✅ AUGMENTÉ : 30 secondes
});

// Configuration pour les requêtes authentifiées
export const authenticatedApiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000, // ✅ AUGMENTÉ : 30 secondes
  withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification
authenticatedApiClient.addRequestInterceptor((config) => {
  // Ajouter le token depuis localStorage ou session
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401
authenticatedApiClient.addErrorInterceptor((error) => {
  if (error.status === 401) {
    // Redirection vers la page de connexion
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
  return Promise.reject(error);
});

export default ApiClient; 