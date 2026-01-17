import { API_URL } from './constants';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Token yönetimi için yardımcı fonksiyonlar
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kg_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('kg_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('kg_token');
};

// Default silent errors - don't log these to console
const defaultSilentErrors = [401, 404]; // 401: handled by redirect, 404: endpoint might not exist yet

/**
 * Handle 401 Unauthorized errors
 */
function handle401Error(token: string | null): void {
  // Sadece token varsa ve geçersizse çıkış yap
  if (token) {
    // Token varsa ama 401 dönüyorsa, token geçersizdir
    removeToken();
  }
}

/**
 * Merkezi API İstek Fonksiyonu
 */
export async function fetchAPI<T>(
  endpoint: string, 
  options: FetchOptions = {},
  requireAuth: boolean = false,
  silentErrors: number[] = [] // Additional silent error codes beyond defaults
): Promise<T> {
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json', 
    ...options.headers 
  };
  
  // Auth token varsa header'a ekle
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error('Authentication required');
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    next: { revalidate: options.next?.revalidate ?? 60 }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    
    // Combine default silent errors with additional ones
    const allSilentErrors = [...defaultSilentErrors, ...silentErrors];
    
    // Don't log errors for silent status codes
    if (!allSilentErrors.includes(res.status)) {
      console.error(`API Error: ${res.status} at ${endpoint}`, errorData);
    }
    
    if (res.status === 401) {
      handle401Error(token);
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    
    throw new Error(errorData.message || 'API isteği başarısız oldu');
  }

  return res.json();
}

/**
 * Auth gerektiren istekler için wrapper
 */
export async function fetchAuthAPI<T>(
  endpoint: string, 
  options: FetchOptions = {}, 
  silentErrors: number[] = []
): Promise<T> {
  return fetchAPI<T>(endpoint, options, true, silentErrors);
}

/**
 * API İstek Fonksiyonu - Headers ile birlikte döner
 */
export async function fetchAPIWithHeaders<T>(
  endpoint: string, 
  options: FetchOptions = {},
  requireAuth: boolean = false,
  silentErrors: number[] = []
): Promise<{ data: T; headers: Record<string, string> }> {
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json', 
    ...options.headers 
  };
  
  // Auth token varsa header'a ekle
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error('Authentication required');
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    next: { revalidate: options.next?.revalidate ?? 60 }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    
    // Combine default silent errors with additional ones
    const allSilentErrors = [...defaultSilentErrors, ...silentErrors];
    
    // Don't log errors for silent status codes
    if (!allSilentErrors.includes(res.status)) {
      console.error(`API Error: ${res.status} at ${endpoint}`, errorData);
    }
    
    if (res.status === 401) {
      handle401Error(token);
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    
    throw new Error(errorData.message || 'API isteği başarısız oldu');
  }

  // Extract headers
  const responseHeaders: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const data = await res.json();
  return { data, headers: responseHeaders };
}