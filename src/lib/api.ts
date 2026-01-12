import { API_URL } from './constants';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

/**
 * Merkezi API İstek Fonksiyonu
 * @param endpoint - API yolu (örn: '/kg/v1/recipes')
 * @param options - Fetch seçenekleri
 */
export async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    
    // Auth token varsa header'a ekle (İleride giriş yapıldığında kullanılacak)
    // const token = localStorage.getItem('token');
    // if (token) {
    //    headers['Authorization'] = `Bearer ${token}`;
    // }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        // Next.js Cache ayarları (Varsayılan: force-cache). 
        // Verinin taze kalması için 'no-store' veya 'revalidate' kullanılabilir.
        next: { revalidate: 60 } 
    });

    if (!res.ok) {
        // Hata yönetimi
        console.error(`API Error: ${res.status} at ${endpoint}`);
        throw new Error('API isteği başarısız oldu');
    }

    const json = await res.json();
    return json;
}