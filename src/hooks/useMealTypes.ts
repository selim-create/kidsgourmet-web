import useSWR from 'swr';
import { MealType } from '@/types/taxonomy';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Taxonomy request failed: ${response.status}`);
  }
  return response.json();
};

/**
 * Hook to fetch all meal types through the same-origin cached taxonomy route.
 */
export function useMealTypes() {
  const { data, error, isLoading } = useSWR<MealType[]>(
    '/api/taxonomies?name=meal-type',
    fetcher
  );
  
  return {
    mealTypes: data || [],
    isLoading,
    error
  };
}
