import { API_URL } from './constants';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Token yönetimi için yardımcı fonksiyonlar
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kg_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('kg_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('kg_token');
};

/**
 * Merkezi API İstek Fonksiyonu
 */
export async function fetchAPI<T>(
  endpoint: string, 
  options: FetchOptions = {},
  requireAuth: boolean = false
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
    console.error(`API Error: ${res.status} at ${endpoint}`, errorData);
    
    if (res.status === 401) {
      removeToken();
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    
    throw new Error(errorData.message || 'API isteği başarısız oldu');
  }

  return res.json();
}

/**
 * Auth gerektiren istekler için wrapper
 */
export async function fetchAuthAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  return fetchAPI<T>(endpoint, options, true);
}