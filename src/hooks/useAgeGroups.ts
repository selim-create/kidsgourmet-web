import useSWR from 'swr';
import { AgeGroup } from '@/types/taxonomy';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Taxonomy request failed: ${response.status}`);
  }
  return response.json();
};

/**
 * Hook to fetch all age groups through the same-origin cached taxonomy route.
 */
export function useAgeGroups() {
  const { data, error, isLoading } = useSWR<AgeGroup[]>(
    '/api/taxonomies?name=age-group',
    fetcher
  );
  
  return {
    ageGroups: data || [],
    isLoading,
    error
  };
}
