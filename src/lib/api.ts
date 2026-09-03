import { API_URL } from './constants';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  revalidate?: number;
  tags?: string[];
}

export interface FetchErrorInfo {
  type: 'network' | 'timeout' | 'cors' | 'auth' | 'server' | 'rate_limit' | 'unknown';
  message: string;
  userMessage: string;
  canRetry: boolean;
  statusCode?: number;
}

// Rate limit error type
export interface RateLimitError {
  code: 'rate_limit_exceeded';
  message: string;
  data: {
    status: 429;
    retry_after: number;
    limit: number;
    window: number;
  };
}

// Check if error is rate limit
export function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as RateLimitError).code === 'rate_limit_exceeded'
  );
}

/**
 * Legacy WordPress fallbacks are only useful when the preferred endpoint is
 * genuinely unavailable. Retrying the same origin through a second endpoint
 * during 5xx/508, rate-limit, network, timeout or CORS failures amplifies load
 * while the origin is already unhealthy.
 */
export function shouldUseLegacyFallback(error: unknown): boolean {
  const statusCode = (error as { errorInfo?: FetchErrorInfo })?.errorInfo?.statusCode;
  return statusCode === 404;
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
 * Build request headers without forcing JSON Content-Type on public GET/HEAD calls.
 * Non-GET requests keep the existing JSON default unless the caller overrides it.
 */
function createRequestHeaders(options: FetchOptions): Record<string, string> {
  const headers: Record<string, string> = { ...options.headers };
  const method = (options.method ?? 'GET').toUpperCase();
  const hasContentType = Object.keys(headers).some(
    (key) => key.toLowerCase() === 'content-type'
  );

  if (method !== 'GET' && method !== 'HEAD' && !hasContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * Create a rate limit error from response
 */
function createRateLimitError(res: Response, errorData: { data?: { retry_after?: number } }): RateLimitError {
  const retryAfter = errorData.data?.retry_after || parseInt(res.headers.get('Retry-After') || '60');
  
  return {
    code: 'rate_limit_exceeded',
    message: `Çok fazla istek gönderdiniz. Lütfen ${retryAfter} saniye bekleyin.`,
    data: {
      status: 429,
      retry_after: retryAfter,
      limit: parseInt(res.headers.get('X-RateLimit-Limit') || '100'),
      window: 60,
    },
  };
}

/**
 * Handle 401 Unauthorized errors
 */
function handle401Error(token: string | null): void {
  // Only logout if token exists and is invalid
  if (token) {
    // If token exists but 401 is returned, token is invalid
    removeToken();
  }
}

/**
 * Hata tipini belirle ve kullanıcı dostu mesaj oluştur
 * Determine error type and create user-friendly message
 */
export function analyzeError(error: any, statusCode?: number): FetchErrorInfo {
  // Network/connection errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: error.message,
      userMessage: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
      canRetry: true,
    };
  }
  
  // Timeout errors
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return {
      type: 'timeout',
      message: error.message,
      userMessage: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
      canRetry: true,
    };
  }
  
  // CORS errors
  if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
    return {
      type: 'cors',
      message: error.message,
      userMessage: 'Bağlantı hatası oluştu. Lütfen sayfayı yenileyip tekrar deneyin.',
      canRetry: true,
    };
  }
  
  // Rate limit errors (429)
  if (statusCode === 429) {
    return {
      type: 'rate_limit',
      message: 'Rate limit exceeded',
      userMessage: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.',
      canRetry: true,
      statusCode: 429,
    };
  }
  
  // Authentication errors
  if (statusCode === 401) {
    return {
      type: 'auth',
      message: 'Unauthorized',
      userMessage: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
      canRetry: false,
      statusCode: 401,
    };
  }
  
  // Server errors (5xx)
  if (statusCode && statusCode >= 500) {
    return {
      type: 'server',
      message: error.message || 'Server error',
      userMessage: 'Sunucu hatası oluştu. Lütfen birkaç dakika sonra tekrar deneyin.',
      canRetry: true,
      statusCode,
    };
  }
  
  // Other API errors
  if (statusCode && statusCode >= 400) {
    return {
      type: 'server',
      message: error.message || 'API error',
      userMessage: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      canRetry: false,
      statusCode,
    };
  }
  
  // Unknown errors
  return {
    type: 'unknown',
    message: error.message || 'Unknown error',
    userMessage: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    canRetry: true,
  };
}

/**
 * Merkezi API İstek Fonksiyonu
 * Central API Request Function with enhanced error handling
 */
export async function fetchAPI<T>(
  endpoint: string, 
  options: FetchOptions = {},
  requireAuth: boolean = false,
  silentErrors: number[] = [] // Additional silent error codes beyond defaults
): Promise<T> {
  const headers = createRequestHeaders(options);
  
  // Auth token varsa header'a ekle
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    const authError = new Error('Authentication required');
    (authError as any).errorInfo = analyzeError(authError, 401);
    throw authError;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      next: { revalidate: options.next?.revalidate ?? 60 }
    });

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('API returned non-JSON response:', text.substring(0, 200));
      const error = new Error(`API returned ${contentType || 'unknown'} instead of JSON. Status: ${res.status}`);
      (error as any).errorInfo = analyzeError(error, res.status);
      throw error;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      // Combine default silent errors with additional ones
      const allSilentErrors = [...defaultSilentErrors, ...silentErrors];
      
      // Don't log errors for silent status codes
      if (!allSilentErrors.includes(res.status)) {
        console.error(`API Error: ${res.status} at ${endpoint}`, errorData);
      }
      
      // Handle rate limiting (429)
      if (res.status === 429) {
        throw createRateLimitError(res, errorData);
      }
      
      if (res.status === 401) {
        handle401Error(token);
      }
      
      const error = new Error(errorData.message || 'API isteği başarısız oldu');
      (error as any).errorInfo = analyzeError(error, res.status);
      throw error;
    }

    return res.json();
  } catch (error) {
    // Network, timeout, CORS errors
    if (!(error as any).errorInfo) {
      const errorInfo = analyzeError(error);
      (error as any).errorInfo = errorInfo;
    }
    throw error;
  }
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
 * API Request Function with Headers - with enhanced error handling
 */
export async function fetchAPIWithHeaders<T>(
  endpoint: string, 
  options: FetchOptions = {},
  requireAuth: boolean = false,
  silentErrors: number[] = []
): Promise<{ data: T; headers: Record<string, string> }> {
  const headers = createRequestHeaders(options);
  
  // Auth token varsa header'a ekle
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    const authError = new Error('Authentication required');
    (authError as any).errorInfo = analyzeError(authError, 401);
    throw authError;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      next: { revalidate: options.next?.revalidate ?? 60 }
    });

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('API returned non-JSON response:', text.substring(0, 200));
      const error = new Error(`API returned ${contentType || 'unknown'} instead of JSON. Status: ${res.status}`);
      (error as any).errorInfo = analyzeError(error, res.status);
      throw error;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      // Combine default silent errors with additional ones
      const allSilentErrors = [...defaultSilentErrors, ...silentErrors];
      
      // Don't log errors for silent status codes
      if (!allSilentErrors.includes(res.status)) {
        console.error(`API Error: ${res.status} at ${endpoint}`, errorData);
      }
      
      // Handle rate limiting (429)
      if (res.status === 429) {
        throw createRateLimitError(res, errorData);
      }
      
      if (res.status === 401) {
        handle401Error(token);
      }
      
      const error = new Error(errorData.message || 'API isteği başarısız oldu');
      (error as any).errorInfo = analyzeError(error, res.status);
      throw error;
    }

    // Extract headers
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const data = await res.json();
    return { data, headers: responseHeaders };
  } catch (error) {
    // Network, timeout, CORS errors
    if (!(error as any).errorInfo) {
      const errorInfo = analyzeError(error);
      (error as any).errorInfo = errorInfo;
    }
    throw error;
  }
}