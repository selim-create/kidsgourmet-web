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

// Transform function for WordPress REST API format
const transformRecipe = (wpRecipe: any): RecipeCard => ({
  id: wpRecipe.id,
  title: typeof wpRecipe.title === 'object' ? wpRecipe.title.rendered : wpRecipe.title,
  slug: wpRecipe.slug,
  image: wpRecipe.image || wpRecipe._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  age_group: wpRecipe.age_groups?.[0] || wpRecipe.age_group || '+6 Ay',
  prep_time: wpRecipe.prep_time || '15 dk',
});

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
    
    try {
      const response = await fetchAPI<any>(`${API_ENDPOINTS.RECIPES}?${params.toString()}`);
      
      // Response format kontrolü
      if (Array.isArray(response)) {
        return response.map(transformRecipe);
      } else if (response && Array.isArray(response.data)) {
        return response.data.map(transformRecipe);
      } else if (response && Array.isArray(response.recipes)) {
        return response.recipes.map(transformRecipe);
      }
      
      console.warn('Unexpected API response format:', response);
      return [];
    } catch (error) {
      console.error('Recipe fetch error:', error);
      return [];
    }
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
    try {
      const response = await fetchAPI<any>(`${API_ENDPOINTS.RECIPES_FEATURED}?limit=${limit}`);
      
      // Response format kontrolü
      if (Array.isArray(response)) {
        return response.map(transformRecipe);
      } else if (response && Array.isArray(response.data)) {
        return response.data.map(transformRecipe);
      } else if (response && Array.isArray(response.recipes)) {
        return response.recipes.map(transformRecipe);
      }
      
      console.warn('Unexpected API response format:', response);
      return [];
    } catch (error) {
      console.error('Featured recipes fetch error:', error);
      return [];
    }
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