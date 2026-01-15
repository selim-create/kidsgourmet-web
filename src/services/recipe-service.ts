import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS, WP_API_NAMESPACE } from '@/lib/constants';
import { Recipe, RecipeCard, CrossSellInfo } from '@/lib/types';

export interface RecipeFilters {
  page?: number;
  perPage?: number;
  ageGroup?: string;
  dietType?: string;
  mealType?: string;           // YENİ
  specialCondition?: string;   // YENİ
  ingredient?: string;         // YENİ
  allergenFree?: string[];
  search?: string;
  orderBy?: 'date' | 'popular' | 'prep_time';  // YENİ
  order?: 'asc' | 'desc';      // YENİ
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
const transformWPRecipeToFull = (wp: any): Recipe => {
  // Ingredients transform - yeni format desteği
  const rawIngredients = wp.ingredients || wp.meta?._kg_ingredients || [];
  const ingredients = Array.isArray(rawIngredients) 
    ? rawIngredients.map((ing: any, index: number) => ({
        id: ing.id ?? index,
        name: ing.name || ing.text || ing,
        amount: ing.amount || '',
        unit: ing.unit || '',
        ingredient_id: ing.ingredient_id || null,
        text: ing.text || ing.name || ing, // Backward compatibility
      }))
    : [];

  // Instructions transform - yeni format desteği
  const rawInstructions = wp.instructions || wp.meta?._kg_instructions || [];
  const instructions = Array.isArray(rawInstructions)
    ? rawInstructions.map((inst: any, index: number) => ({
        id: inst.id ?? index + 1,
        title: inst.title || `Adım ${index + 1}`,
        text: inst.text || inst,
        tip: inst.tip || '',
      }))
    : [];

  // Cross-sell transform - hibrit sistem desteği
  let cross_sell: CrossSellInfo | undefined;
  const crossSellData = wp.cross_sell || wp.meta?._kg_cross_sell;
  
  if (crossSellData) {
    if (typeof crossSellData === 'object') {
      cross_sell = {
        mode: crossSellData.mode || 'manual',
        url: crossSellData.url || '',
        title: crossSellData.title || 'Tariften.com\'da keşfet',
        description: crossSellData.description,
        image: crossSellData.image,
        ingredient: crossSellData.ingredient,
        tariften_id: crossSellData.tariften_id,
      };
    } else if (wp.meta?._kg_cross_sell_url) {
      // Eski format desteği (backward compatibility)
      cross_sell = {
        mode: 'manual',
        url: wp.meta._kg_cross_sell_url,
        title: wp.meta._kg_cross_sell_title || 'Tariften.com',
      };
    }
  }

  return {
    id: wp.id,
    title: typeof wp.title === 'object' ? wp.title.rendered : (wp.title || ''),
    slug: wp.slug || '',
    content: typeof wp.content === 'object' ? wp.content.rendered : (wp.content || ''),
    excerpt: typeof wp.excerpt === 'object' ? wp.excerpt.rendered : (wp.excerpt || ''),
    image: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    prep_time: wp.prep_time || wp.meta?._kg_prep_time || '15 dk',
    ingredients,
    instructions,
    nutrition: {
      calories: wp.nutrition?.calories || wp.meta?._kg_calories || '',
      protein: wp.nutrition?.protein || wp.meta?._kg_protein || '',
      fiber: wp.nutrition?.fiber || wp.meta?._kg_fiber || '',
      vitamins: wp.nutrition?.vitamins || wp.meta?._kg_vitamins || '',
    },
    allergens: wp.allergens || wp._embedded?.['wp:term']?.flat()
      ?.filter((t: any) => t.taxonomy === 'allergen')
      ?.map((t: any) => t.name) || [],
    age_groups: wp.age_groups || wp._embedded?.['wp:term']?.flat()
      ?.filter((t: any) => t.taxonomy === 'age-group')
      ?.map((t: any) => t.name) || [],
    diet_types: wp.diet_types || wp._embedded?.['wp:term']?.flat()
      ?.filter((t: any) => t.taxonomy === 'diet-type')
      ?.map((t: any) => t.name) || [],
    video_url: wp.video_url || wp.meta?._kg_video_url || '',
    substitutes: wp.substitutes || wp.meta?._kg_substitutes || [],
    is_featured: wp.is_featured || wp.meta?._kg_is_featured === '1',
    expert: {
      name: wp.expert?.name || wp.meta?._kg_expert_name || '',
      title: wp.expert?.title || wp.meta?._kg_expert_title || '',
      approved: wp.expert?.approved || wp.meta?._kg_expert_approved === '1',
    },
    related_recipes: wp.related_recipes || [],
    cross_sell,
  };
};

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
  getAll: async (filters: RecipeFilters = {}): Promise<{
    recipes: RecipeCard[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> => {
    const { 
      page = 1, 
      perPage = 12, 
      ageGroup, 
      dietType, 
      mealType,
      specialCondition,
      ingredient,
      search,
      orderBy = 'date',
      order = 'desc'
    } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      orderby: orderBy,
      order: order,
    });
    
    if (ageGroup) params.append('age-group', ageGroup);
    if (dietType) params.append('diet-type', dietType);
    if (mealType) params.append('meal-type', mealType);
    if (specialCondition) params.append('special-condition', specialCondition);
    if (ingredient) params.append('ingredient', ingredient);
    if (search) params.append('search', search);
    
    try {
      // Önce özel kg/v1 endpoint'ini dene
      const response = await fetchAPI<any>(`${API_ENDPOINTS.RECIPES}?${params.toString()}`);
      
      // Response format kontrolü
      if (Array.isArray(response)) {
        return {
          recipes: response.map(transformRecipe),
          total: response.length,
          page: page,
          per_page: perPage,
          total_pages: 1,
        };
      } else if (response && Array.isArray(response.data)) {
        return {
          recipes: response.data.map(transformRecipe),
          total: response.total || response.data.length,
          page: response.page || page,
          per_page: response.per_page || perPage,
          total_pages: response.total_pages || 1,
        };
      } else if (response && Array.isArray(response.recipes)) {
        return {
          recipes: response.recipes.map(transformRecipe),
          total: response.total || response.recipes.length,
          page: response.page || page,
          per_page: response.per_page || perPage,
          total_pages: response.total_pages || 1,
        };
      }
      
      console.warn('Unexpected API response format:', response);
      return {
        recipes: [],
        total: 0,
        page: page,
        per_page: perPage,
        total_pages: 0,
      };
    } catch (error) {
      console.log('Falling back to WP REST API for recipes');
      try {
        // Fallback: Standart WP REST API
        const response = await fetchAPI<any[]>(
          `${WP_API_NAMESPACE}/recipe?page=${page}&per_page=${perPage}&_embed`
        );
        return {
          recipes: (response || []).map(transformWPRecipeToCard),
          total: response?.length || 0,
          page: page,
          per_page: perPage,
          total_pages: 1,
        };
      } catch (fallbackError) {
        console.error('Both API calls failed:', fallbackError);
        return {
          recipes: [],
          total: 0,
          page: page,
          per_page: perPage,
          total_pages: 0,
        };
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

  /**
   * Filtrelere göre tarif getir (yaş grubu, öğün tipi vs.)
   * Not: WordPress REST API parametreleri hyphen format kullanır (age-group, meal-type)
   */
  getByFilters: async (filters: {
    age_group?: string;
    meal_type?: string;
    per_page?: number;
    orderby?: string;
  }): Promise<Recipe[]> => {
    try {
      const params = new URLSearchParams();
      
      // WordPress REST API için taxonomy filtresi - hyphen formatına çevir
      if (filters.age_group) {
        params.append('age-group', filters.age_group);
      }
      if (filters.meal_type) {
        params.append('meal-type', filters.meal_type);
      }
      if (filters.per_page) {
        params.append('per_page', filters.per_page.toString());
      }
      if (filters.orderby) {
        params.append('orderby', filters.orderby);
      }
      
      const queryString = params.toString();
      const endpoint = queryString 
        ? `${API_ENDPOINTS.RECIPES}?${queryString}` 
        : API_ENDPOINTS.RECIPES;
      
      const response = await fetchAPI<Recipe[] | { recipes: Recipe[] }>(endpoint);
      
      // Response array veya object olabilir
      if (Array.isArray(response)) {
        return response;
      }
      return response.recipes || [];
    } catch (error) {
      console.error('getByFilters error:', error);
      return [];
    }
  },

  /**
   * Tarif ara
   */
  search: async (query: string, options?: { per_page?: number }): Promise<Recipe[]> => {
    try {
      const params = new URLSearchParams({ search: query });
      if (options?.per_page) {
        params.append('per_page', options.per_page.toString());
      }
      
      const response = await fetchAPI<Recipe[] | { recipes: Recipe[] }>(
        `${API_ENDPOINTS.RECIPES}?${params.toString()}`
      );
      
      if (Array.isArray(response)) {
        return response;
      }
      return response.recipes || [];
    } catch (error) {
      console.error('search error:', error);
      return [];
    }
  },
};