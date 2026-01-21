import useSWR from 'swr';
import { blogService, BlogPost } from '@/services/blog-service';

// Field definitions for different views
const POST_LIST_FIELDS = 'id,title,slug,image,excerpt,author,read_time,created_at';
const POST_CARD_FIELDS = 'id,title,slug,image,excerpt,read_time';

interface BlogFilters {
  page?: number;
  perPage?: number;
  category?: number;
  fields?: 'list' | 'card' | 'full';
}

interface BlogResponse {
  posts: BlogPost[];
  total: number;
  totalPages: number;
}

export function useBlogPosts(filters?: BlogFilters) {
  const { page = 1, perPage = 12, category, fields } = filters || {};
  
  // Build enhanced filters with sparse fieldsets
  const enhancedFilters: any = { page, perPage, category };
  
  // Add sparse fieldsets if specified
  if (fields) {
    const fieldSet = fields === 'list' ? POST_LIST_FIELDS :
                     fields === 'card' ? POST_CARD_FIELDS : '';
    if (fieldSet) {
      enhancedFilters.fields = fieldSet;
    }
  }
  
  const key = ['posts', page, perPage, category, fields].filter(Boolean);
  
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
