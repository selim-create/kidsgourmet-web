import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

// Search result interfaces for different content types
export interface RecipeSearchResult {
  id: number;
  title: string;
  slug: string;
  image: string;
  age_group: string;
  prep_time: string;
  excerpt?: string;
}

export interface IngredientSearchResult {
  id: number;
  title: string;
  slug: string;
  image: string;
  age_group: string;
  excerpt: string;
  allergen_level?: string;
  season?: string;
}

export interface PostSearchResult {
  id: number;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  date?: string;
}

export interface DiscussionSearchResult {
  id: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  comment_count: number;
}

// Categorized results interface
export interface SearchCategorized {
  recipes: RecipeSearchResult[];
  ingredients: IngredientSearchResult[];
  posts: PostSearchResult[];
  discussions: DiscussionSearchResult[];
}

// Counts interface
export interface SearchCounts {
  total: number;
  recipes: number;
  ingredients: number;
  posts: number;
  discussions: number;
}

// Main search response interface
export interface SearchResponse {
  success: boolean;
  query: string;
  type: string;
  results: Array<RecipeSearchResult | IngredientSearchResult | PostSearchResult | DiscussionSearchResult>;
  categorized: SearchCategorized;
  counts: SearchCounts;
  total: number;
}

// Search parameters interface
export interface SearchParams {
  q: string;
  type?: 'all' | 'recipe' | 'ingredient' | 'post' | 'discussion';
  age_group?: string;
  per_page?: number;
}

export const searchService = {
  /**
   * Search across all content types
   */
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const { q, type = 'all', age_group, per_page = 20 } = params;
    
    const queryParams = new URLSearchParams({
      q,
      type,
      per_page: per_page.toString(),
    });
    
    if (age_group) {
      queryParams.append('age_group', age_group);
    }
    
    try {
      const response = await fetchAPI<SearchResponse>(
        `${API_ENDPOINTS.SEARCH}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('Search API error:', error);
      // Return empty response on error
      return {
        success: false,
        query: q,
        type,
        results: [],
        categorized: {
          recipes: [],
          ingredients: [],
          posts: [],
          discussions: [],
        },
        counts: {
          total: 0,
          recipes: 0,
          ingredients: 0,
          posts: 0,
          discussions: 0,
        },
        total: 0,
      };
    }
  },
};
