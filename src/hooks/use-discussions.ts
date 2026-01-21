import useSWR from 'swr';
import { 
  getDiscussions, 
  getDiscussionById, 
  getCircles, 
  getTopContributors 
} from '@/lib/community';

interface DiscussionFilters {
  circle_id?: number;
  page?: number;
  per_page?: number;
  featured_only?: boolean;
  expert_answered?: boolean;
}

export function useDiscussions(filters?: DiscussionFilters) {
  const key = filters ? ['discussions', JSON.stringify(filters)] : ['discussions'];
  
  return useSWR(
    key,
    () => getDiscussions(filters || {}),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 saniye (topluluk içeriği daha dinamik)
      keepPreviousData: true,
    }
  );
}

export function useDiscussion(id: number) {
  return useSWR(
    id ? ['discussion', id] : null,
    () => getDiscussionById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

export function useCircles() {
  return useSWR(
    ['circles'],
    () => getCircles(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 dakika
    }
  );
}

export function useTopContributors(limit: number = 5, period: 'week' | 'month' | 'all' = 'week') {
  return useSWR(
    ['top-contributors', limit, period],
    () => getTopContributors(limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 dakika
    }
  );
}
