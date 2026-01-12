import useSWR from 'swr';
import { MealType } from '@/types/taxonomy';
import { API_URL, API_ENDPOINTS } from '@/lib/constants';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * Hook to fetch all meal types from the WordPress API
 */
export function useMealTypes() {
  const { data, error, isLoading } = useSWR<MealType[]>(
    `${API_URL}${API_ENDPOINTS.MEAL_TYPES}?per_page=100`,
    fetcher
  );
  
  return {
    mealTypes: data || [],
    isLoading,
    error
  };
}
