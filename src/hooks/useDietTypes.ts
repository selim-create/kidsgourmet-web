import useSWR from 'swr';
import { DietType } from '@/types/taxonomy';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Taxonomy request failed: ${response.status}`);
  }
  return response.json();
};

/**
 * Hook to fetch all diet types through the same-origin cached taxonomy route.
 */
export function useDietTypes() {
  const { data, error, isLoading } = useSWR<DietType[]>(
    '/api/taxonomies?name=diet-type',
    fetcher
  );
  
  return {
    dietTypes: data || [],
    isLoading,
    error
  };
}
