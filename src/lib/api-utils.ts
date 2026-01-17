import { VaccineStats } from './types';

/**
 * Safely extracts data from API response
 * Checks for common wrapper fields like data, response, result
 */
export function extractApiData<T>(response: unknown): T {
  if (response === null || response === undefined) {
    throw new Error('API response is empty');
  }

  // If it's already an array
  if (Array.isArray(response)) {
    return response as T;
  }

  // If it's an object, check for wrapper
  if (typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    
    // Common wrapper structures
    if ('data' in obj && obj.data !== undefined) {
      return obj.data as T;
    }
    if ('result' in obj && obj.result !== undefined) {
      return obj.result as T;
    }
    if ('response' in obj && obj.response !== undefined) {
      return obj.response as T;
    }
    
    // No wrapper, return as is
    return response as T;
  }

  return response as T;
}

/**
 * Safe array access - always returns an array
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  // Convert single item to array - log warning about unexpected structure
  console.warn('ensureArray: Converting non-array value to array. This may indicate an API structure mismatch.', value);
  return [value as T];
}

/**
 * Default vaccine stats object
 */
export const defaultVaccineStats: VaccineStats = {
  total: 0,
  done: 0,
  upcoming: 0,
  overdue: 0,
  skipped: 0,
  completion_percentage: 0,
};
