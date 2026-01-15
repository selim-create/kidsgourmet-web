import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS, WP_API_NAMESPACE } from '@/lib/constants';
import { Ingredient } from '@/lib/types';

export interface IngredientFilters {
  page?: number;
  perPage?: number;
  startAge?: string;
  allergyRisk?: string;
  season?: string;
}

export interface IngredientsResponse {
  ingredients: Ingredient[];
  total: number;
  pages: number;
}

// Type guard to check if response is paginated
function isIngredientsResponse(response: any): response is IngredientsResponse {
  return response && typeof response === 'object' && 'ingredients' in response && 'total' in response && 'pages' in response;
}

// Transform function for WordPress REST API format to Ingredient - GÜNCELLENMİŞ
const transformWPIngredient = (wp: any): Ingredient => ({
  id: wp.id,
  name: typeof wp.name === 'object' ? wp.name.rendered : (wp.name || wp.title?.rendered || ''),
  slug: wp.slug || '',
  description: typeof wp.description === 'object' ? wp.description.rendered : (wp.description || wp.excerpt?.rendered || ''),
  image: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
         wp.featured_media_url || 
         'https://placehold.co/400x400/AED581/ffffff?text=Malzeme',
  category: wp.meta?._kg_category || wp.acf?.category || '',
  start_age: wp.meta?._kg_start_age || wp.acf?.start_age || '+6 Ay',
  benefits: wp.meta?._kg_benefits || wp.acf?.benefits || '',
  prep_methods: wp.meta?._kg_prep_methods || wp.acf?.prep_methods || [],
  allergy_risk: wp.meta?._kg_allergy_risk || wp.acf?.allergy_risk || 'Düşük',
  season: wp.meta?._kg_season || wp.acf?.season || 'Tüm Yıl',
  storage_tips: wp.meta?._kg_storage_tips || wp.acf?.storage_tips,
  
  // 🆕 Yeni alanlar
  prep_by_age: wp.meta?._kg_prep_by_age || wp.acf?.prep_by_age || [],
  selection_tips: wp.meta?._kg_selection_tips || wp.acf?.selection_tips || '',
  pro_tips: wp.meta?._kg_pro_tips || wp.acf?.pro_tips || '',
  pairings: wp.meta?._kg_pairings || wp.acf?.pairings || [],
  nutrition: wp.meta?._kg_nutrition || wp.acf?.nutrition || {},
  
  related_recipes: wp.meta?._kg_related_recipes || wp.acf?.related_recipes || [],
  faq: wp.meta?._kg_faq || wp.acf?.faq || [],
  
  ai_generated: wp.meta?._kg_ai_generated || wp.acf?.ai_generated || false,
  image_source: wp.meta?._kg_image_source || wp.acf?.image_source || '',
  
  // 🆕 Backend konsolidasyonu sonrası yeni alanlar
  allergen_info: wp.meta?._kg_allergen_info || wp.acf?.allergen_info || null,
  allergens: wp.meta?._kg_allergens || wp.acf?.allergens || [],
  nutrition_per_100g: wp.meta?._kg_nutrition_per_100g || wp.acf?.nutrition_per_100g || null,
  prep_methods_list: wp.meta?._kg_prep_methods_list || wp.acf?.prep_methods_list || [],
  image_credit: wp.meta?._kg_image_credit || wp.acf?.image_credit || '',
  seo: wp.meta?._kg_seo || wp.acf?.seo || undefined,
});

// Transform function for API response format - GÜNCELLENMİŞ
const transformIngredient = (apiIngredient: any): Ingredient => ({
  id: apiIngredient.id,
  name: typeof apiIngredient.name === 'object' ? apiIngredient.name.rendered : apiIngredient.name,
  slug: apiIngredient.slug,
  description: typeof apiIngredient.description === 'object' ? apiIngredient.description.rendered : apiIngredient.description,
  image: apiIngredient.image || apiIngredient._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  category: apiIngredient.category || '',
  start_age: apiIngredient.start_age || '+6 Ay',
  benefits: apiIngredient.benefits || '',
  prep_methods: apiIngredient.prep_methods || [],
  allergy_risk: apiIngredient.allergy_risk || 'Düşük',
  season: apiIngredient.season || 'Tüm Yıl',
  storage_tips: apiIngredient.storage_tips,
  
  // 🆕 Yeni alanlar
  prep_by_age: apiIngredient.prep_by_age || [],
  selection_tips: apiIngredient.selection_tips || '',
  pro_tips: apiIngredient.pro_tips || '',
  pairings: apiIngredient.pairings || [],
  nutrition: apiIngredient.nutrition || {},
  
  related_recipes: apiIngredient.related_recipes || [],
  faq: apiIngredient.faq || [],
  
  ai_generated: apiIngredient.ai_generated || false,
  image_source: apiIngredient.image_source || '',
  
  // 🆕 Backend konsolidasyonu sonrası yeni alanlar
  allergen_info: apiIngredient.allergen_info || null,
  allergens: apiIngredient.allergens || [],
  nutrition_per_100g: apiIngredient.nutrition_per_100g || null,
  prep_methods_list: apiIngredient.prep_methods_list || [],
  image_credit: apiIngredient.image_credit || '',
  seo: apiIngredient.seo || undefined,
});

export const ingredientService = {
  /**
   * Tüm malzemeleri getir
   */
  getAll: async (filters: IngredientFilters = {}): Promise<Ingredient[] | IngredientsResponse> => {
    const { page = 1, perPage = 24, startAge, allergyRisk, season } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (startAge) params.append('start_age', startAge);
    if (allergyRisk) params.append('allergy_risk', allergyRisk);
    if (season) params.append('season', season);
    
    try {
      // Önce özel kg/v1 endpoint'ini dene
      const response = await fetchAPI<any>(`${API_ENDPOINTS.INGREDIENTS}?${params.toString()}`);
      
      // Response format kontrolü
      if (Array.isArray(response)) {
        return response.map(transformIngredient);
      } else if (response && Array.isArray(response.data)) {
        return response.data.map(transformIngredient);
      } else if (response && Array.isArray(response.ingredients)) {
        // Backend pagination response format: {ingredients: [...], total: 150, pages: 7}
        return {
          ingredients: response.ingredients.map(transformIngredient),
          total: response.total || 0,
          pages: response.pages || 1,
        };
      }
      
      console.warn('Unexpected API response format:', response);
      return [];
    } catch (error) {
      console.log('Falling back to WP REST API for ingredients');
      try {
        // Fallback: Standart WP REST API
        const response = await fetchAPI<any[]>(
          `${WP_API_NAMESPACE}/ingredient?page=${page}&per_page=${perPage}&_embed`
        );
        return (response || []).map(transformWPIngredient);
      } catch (fallbackError) {
        console.error('Both API calls failed for ingredients:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Tekil malzeme detayı (slug ile)
   */
  getBySlug: async (slug: string): Promise<Ingredient | null> => {
    // Undefined/null kontrolü
    if (!slug || slug === 'undefined' || slug === 'null') {
      console.error('getBySlug called with invalid slug:', slug);
      return null;
    }
    
    try {
      // Önce özel kg/v1 endpoint'ini dene
      return await fetchAPI<Ingredient>(API_ENDPOINTS.INGREDIENT_BY_SLUG(slug));
    } catch (error) {
      console.log('Falling back to WP REST API for ingredient slug:', slug);
      try {
        // Fallback: Standart WP REST API
        const ingredients = await fetchAPI<any[]>(
          `${WP_API_NAMESPACE}/ingredient?slug=${slug}&_embed`
        );
        if (ingredients && ingredients.length > 0) {
          return transformWPIngredient(ingredients[0]);
        }
        return null;
      } catch (fallbackError) {
        console.error('Both API calls failed for ingredient slug:', slug, fallbackError);
        return null;
      }
    }
  },

  /**
   * Malzeme arama (Ek gıda rehberi için)
   */
  search: async (query: string): Promise<Ingredient[]> => {
    try {
      const response = await fetchAPI<Ingredient[] | { ingredients: Ingredient[] }>(`${API_ENDPOINTS.INGREDIENTS_SEARCH}?q=${encodeURIComponent(query)}`);
      
      // Response format kontrolü - backend array veya {ingredients: [...]} dönebilir
      if (Array.isArray(response)) {
        return response.map(transformIngredient);
      } else if (response && Array.isArray(response.ingredients)) {
        return response.ingredients.map(transformIngredient);
      }
      return [];
    } catch (error) {
      console.error('Ingredient search error:', error);
      // Fallback: tüm ingredients'ı getir ve frontend'de filtrele
      try {
        const response = await ingredientService.getAll({ perPage: 100 });
        const allIngredients = Array.isArray(response) ? response : response.ingredients;
        const queryLower = query.toLowerCase();
        return allIngredients.filter(ing => 
          ing.name.toLowerCase().includes(queryLower) ||
          ing.description?.toLowerCase().includes(queryLower)
        ).slice(0, 10);
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Kategorileri getir
   */
  getCategories: async (): Promise<string[]> => {
    try {
      // Önce dedicated endpoint'i dene
      const response = await fetchAPI<{terms: {name: string, slug: string}[]}>(`${API_ENDPOINTS.INGREDIENT_CATEGORIES}`);
      if (response?.terms) {
        return response.terms.map(t => t.name);
      }
    } catch (error) {
      console.log('Categories endpoint failed, extracting from ingredients');
    }
    
    // Fallback: Tüm ingredients'tan unique kategorileri çıkar
    try {
      const response = await ingredientService.getAll({ perPage: 200 });
      const allIngredients = Array.isArray(response) ? response : response.ingredients;
      const uniqueCategories = [...new Set(
        allIngredients
          .map(i => i.category)
          .filter((c): c is string => !!c && c.trim() !== '')
      )];
      return uniqueCategories.sort();
    } catch (error) {
      console.error('Failed to get categories:', error);
      return ['Meyveler', 'Sebzeler', 'Proteinler', 'Tahıllar', 'Süt Ürünleri']; // Hardcoded fallback
    }
  },

  /**
   * Mevsimlik malzemeler için filter
   */
  getBySeason: async (season: string): Promise<Ingredient[]> => {
    try {
      const response = await fetchAPI<any>(`${API_ENDPOINTS.INGREDIENTS_BY_SEASON(season)}&per_page=10`);
      if (Array.isArray(response)) {
        return response.map(transformIngredient);
      } else if (response?.ingredients) {
        return response.ingredients.map(transformIngredient);
      }
      return [];
    } catch (error) {
      // Fallback: tüm ingredients'tan filtrele
      const response = await ingredientService.getAll({ perPage: 100 });
      const all = Array.isArray(response) ? response : response.ingredients;
      return all.filter(i => i.season?.includes(season)).slice(0, 10);
    }
  },
};