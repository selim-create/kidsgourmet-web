import useSWR from 'swr';
import { DietType } from '@/types/taxonomy';
import { API_URL, API_ENDPOINTS } from '@/lib/constants';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * Hook to fetch all diet types from the WordPress API
 */
export function useDietTypes() {
  const { data, error, isLoading } = useSWR<DietType[]>(
    `${API_URL}${API_ENDPOINTS.DIET_TYPES}?per_page=100`,
    fetcher
  );
  
  return {
    dietTypes: data || [],
    isLoading,
    error
  };
}
