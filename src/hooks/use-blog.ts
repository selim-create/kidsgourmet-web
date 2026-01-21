import useSWR from 'swr';
import { blogService, BlogPost } from '@/services/blog-service';

interface BlogFilters {
  page?: number;
  perPage?: number;
  category?: number;
}

interface BlogResponse {
  posts: BlogPost[];
  total: number;
  totalPages: number;
}

export function useBlogPosts(filters?: BlogFilters) {
  const { page = 1, perPage = 12, category } = filters || {};
  const key = ['posts', page, perPage, category].filter(Boolean);
  
  return useSWR<BlogResponse>(
    key,
    () => blogService.getAll(page, perPage, category),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );
}

export function useBlogPost(slug: string) {
  return useSWR(
    slug ? ['post', slug] : null,
    () => blogService.getBySlug(slug),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );
}
