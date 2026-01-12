import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Recipe, RecipeCard } from '@/lib/types';

export interface RecipeFilters {
  page?: number;
  perPage?: number;
  ageGroup?: string;
  dietType?: string;
  allergenFree?: string[];
  search?: string;
}

export const recipeService = {
  /**
   * Tüm tarifleri getir (sayfalama ve filtreleme ile)
   */
  getAll: async (filters: RecipeFilters = {}): Promise<RecipeCard[]> => {
    const { page = 1, perPage = 12, ageGroup, dietType, search } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (ageGroup) params.append('age-group', ageGroup);
    if (dietType) params.append('diet-type', dietType);
    if (search) params.append('search', search);
    
    return await fetchAPI<RecipeCard[]>(`${API_ENDPOINTS.RECIPES}?${params.toString()}`);
  },

  /**
   * Tekil tarif detayı (slug ile)
   */
  getBySlug: async (slug: string): Promise<Recipe | null> => {
    try {
      return await fetchAPI<Recipe>(API_ENDPOINTS.RECIPE_BY_SLUG(slug));
    } catch (error) {
      console.error('Recipe fetch error:', error);
      return null;
    }
  },

  /**
   * Öne çıkan tarifler
   */
  getFeatured: async (limit: number = 5): Promise<RecipeCard[]> => {
    return await fetchAPI<RecipeCard[]>(`${API_ENDPOINTS.RECIPES_FEATURED}?limit=${limit}`);
  },

  /**
   * Yaş grubuna göre tarifler
   */
  getByAgeGroup: async (ageSlug: string, limit?: number): Promise<RecipeCard[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return await fetchAPI<RecipeCard[]>(`${API_ENDPOINTS.RECIPES_BY_AGE(ageSlug)}${params}`);
  },

  /**
   * Benzer tarifler
   */
  getRelated: async (recipeId: number, limit: number = 4): Promise<RecipeCard[]> => {
    return await fetchAPI<RecipeCard[]>(`${API_ENDPOINTS.RECIPES}/${recipeId}/related?limit=${limit}`);
  },
};