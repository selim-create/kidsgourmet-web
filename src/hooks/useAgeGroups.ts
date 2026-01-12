import useSWR from 'swr';
import { AgeGroup } from '@/types/taxonomy';
import { API_URL, API_ENDPOINTS } from '@/lib/constants';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * Hook to fetch all age groups from the WordPress API
 */
export function useAgeGroups() {
  const { data, error, isLoading } = useSWR<AgeGroup[]>(
    `${API_URL}${API_ENDPOINTS.AGE_GROUPS}?per_page=100`,
    fetcher
  );
  
  return {
    ageGroups: data || [],
    isLoading,
    error
  };
}
