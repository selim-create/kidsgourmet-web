import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS, WP_API_NAMESPACE } from '@/lib/constants';
import { Recipe, RecipeCard } from '@/lib/types';

export interface RecipeFilters {
  page?: number;
  perPage?: number;
  ageGroup?: string;
  dietType?: string;
  allergenFree?: string[];
  search?: string;
}

// Transform function for WordPress REST API format to RecipeCard
const transformWPRecipeToCard = (wp: any): RecipeCard => ({
  id: wp.id,
  title: typeof wp.title === 'object' ? wp.title.rendered : (wp.title || ''),
  slug: wp.slug || '',
  image: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
         wp.featured_media_url || 
         'https://placehold.co/600x400/FFF8E1/FF8A65?text=Tarif',
  age_group: wp._embedded?.['wp:term']?.flat()
    ?.find((t: any) => t.taxonomy === 'age-group')?.name || '+6 Ay',
  prep_time: wp.meta?._kg_prep_time || wp.acf?.prep_time || '15 dk',
});

// Transform function for WordPress REST API format to full Recipe
const transformWPRecipeToFull = (wp: any): Recipe => ({
  id: wp.id,
  title: typeof wp.title === 'object' ? wp.title.rendered : (wp.title || ''),
  slug: wp.slug || '',
  content: typeof wp.content === 'object' ? wp.content.rendered : (wp.content || ''),
  excerpt: typeof wp.excerpt === 'object' ? wp.excerpt.rendered : (wp.excerpt || ''),
  image: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  prep_time: wp.meta?._kg_prep_time || '15 dk',
  ingredients: wp.meta?._kg_ingredients || [],
  instructions: wp.meta?._kg_instructions || [],
  nutrition: {
    calories: wp.meta?._kg_calories || '',
    protein: wp.meta?._kg_protein || '',
    fiber: wp.meta?._kg_fiber || '',
    vitamins: wp.meta?._kg_vitamins || '',
  },
  allergens: wp._embedded?.['wp:term']?.flat()
    ?.filter((t: any) => t.taxonomy === 'allergen')
    ?.map((t: any) => t.name) || [],
  age_groups: wp._embedded?.['wp:term']?.flat()
    ?.filter((t: any) => t.taxonomy === 'age-group')
    ?.map((t: any) => t.name) || [],
  diet_types: wp._embedded?.['wp:term']?.flat()
    ?.filter((t: any) => t.taxonomy === 'diet-type')
    ?.map((t: any) => t.name) || [],
  video_url: wp.meta?._kg_video_url || '',
  substitutes: wp.meta?._kg_substitutes || [],
  is_featured: wp.meta?._kg_is_featured === '1',
  expert: {
    name: wp.meta?._kg_expert_name || 'Dyt. Uzman',
    title: wp.meta?._kg_expert_title || 'Beslenme Uzmanı',
    approved: wp.meta?._kg_expert_approved === '1',
  },
  related_recipes: [],
  cross_sell: wp.meta?._kg_cross_sell_url ? {
    title: wp.meta?._kg_cross_sell_title || 'Tariften.com',
    url: wp.meta?._kg_cross_sell_url,
  } : undefined,
});

// Transform function for custom API format
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
      // Önce özel kg/v1 endpoint'ini dene
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
      console.log('Falling back to WP REST API for recipes');
      try {
        // Fallback: Standart WP REST API
        const response = await fetchAPI<any[]>(
          `${WP_API_NAMESPACE}/recipe?page=${page}&per_page=${perPage}&_embed`
        );
        return (response || []).map(transformWPRecipeToCard);
      } catch (fallbackError) {
        console.error('Both API calls failed:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Tekil tarif detayı (slug ile)
   */
  getBySlug: async (slug: string): Promise<Recipe | null> => {
    // Undefined/null kontrolü
    if (!slug || slug === 'undefined' || slug === 'null') {
      console.error('getBySlug called with invalid slug:', slug);
      return null;
    }
    
    try {
      // Önce özel kg/v1 endpoint'ini dene
      return await fetchAPI<Recipe>(API_ENDPOINTS.RECIPE_BY_SLUG(slug));
    } catch (error) {
      console.log('Falling back to WP REST API for slug:', slug);
      try {
        // Fallback: Standart WP REST API
        const recipes = await fetchAPI<any[]>(
          `${WP_API_NAMESPACE}/recipe?slug=${slug}&_embed`
        );
        if (recipes && recipes.length > 0) {
          return transformWPRecipeToFull(recipes[0]);
        }
        return null;
      } catch (fallbackError) {
        console.error('Both API calls failed for slug:', slug, fallbackError);
        return null;
      }
    }
  },

  /**
   * Öne çıkan tarifler
   */
  getFeatured: async (limit: number = 5): Promise<RecipeCard[]> => {
    try {
      // Önce özel endpoint'i dene
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
      console.log('Falling back to WP REST API for featured recipes');
      try {
        // Fallback: WP REST API ile featured meta query
        const response = await fetchAPI<any[]>(
          `${WP_API_NAMESPACE}/recipe?per_page=${limit}&_embed&orderby=date&order=desc`
        );
        return (response || []).map(transformWPRecipeToCard);
      } catch (fallbackError) {
        console.error('Both API calls failed for featured recipes:', fallbackError);
        return [];
      }
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