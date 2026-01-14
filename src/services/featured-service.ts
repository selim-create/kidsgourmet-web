import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface FeaturedItem {
  id: number;
  type: 'recipe' | 'post' | 'question' | 'ingredient' | 'sponsor';
  title: string;
  slug: string;
  image?: string;
  excerpt?: string;
  date: string;
  meta: {
    // Recipe meta
    age_group?: string;
    age_group_color?: string;
    prep_time?: string;
    rating?: number;
    rating_count?: number;
    meal_type?: string;
    diet_types?: string[];
    expert?: {
      name: string;
      title: string;
      approved: boolean;
    };
    // Post/Guide meta
    category?: string;
    author?: string;
    read_time?: string;
    // Question meta
    author_name?: string;
    author_initials?: string;
    answer_count?: number;
    // Sponsor meta
    sponsor_name?: string;
    sponsor_logo?: string;
    sponsor_url?: string;
    has_discount?: boolean;
    discount_text?: string;
  };
}

export const featuredService = {
  getAll: async (limit = 5, type?: string): Promise<FeaturedItem[]> => {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (type && type !== 'all') {
        params.append('type', type);
      }
      
      const response = await fetchAPI<{ success: boolean; data: FeaturedItem[] }>(
        `${API_ENDPOINTS.FEATURED}?${params.toString()}`
      );
      
      return response?.data || [];
    } catch (error) {
      console.error('Featured content yüklenemedi:', error);
      return [];
    }
  }
};
