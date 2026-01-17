import { VaccineStats } from './types';

/**
 * API yanıtından veriyi güvenli şekilde çıkarır
 * Wrapper içindeki data, response, result gibi alanları kontrol eder
 */
export function extractApiData<T>(response: unknown): T {
  if (response === null || response === undefined) {
    throw new Error('API response is empty');
  }

  // Direkt array ise
  if (Array.isArray(response)) {
    return response as T;
  }

  // Object ise wrapper kontrolü
  if (typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    
    // Yaygın wrapper yapıları
    if ('data' in obj && obj.data !== undefined) {
      return obj.data as T;
    }
    if ('result' in obj && obj.result !== undefined) {
      return obj.result as T;
    }
    if ('response' in obj && obj.response !== undefined) {
      return obj.response as T;
    }
    
    // Wrapper yoksa doğrudan döndür
    return response as T;
  }

  return response as T;
}

/**
 * Güvenli array erişimi - her zaman array döner
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  // Tek item ise array'e çevir
  return [value as T];
}

/**
 * Varsayılan vaccine stats objesi
 */
export const defaultVaccineStats: VaccineStats = {
  total: 0,
  done: 0,
  upcoming: 0,
  overdue: 0,
  skipped: 0,
  completion_percentage: 0,
};
