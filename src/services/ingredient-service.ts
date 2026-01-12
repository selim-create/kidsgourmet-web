import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Ingredient } from '@/lib/types';

export interface IngredientFilters {
  page?: number;
  perPage?: number;
  startAge?: string;
  allergyRisk?: string;
  season?: string;
}

// Transform function for API response format
const transformIngredient = (apiIngredient: any): Ingredient => ({
  id: apiIngredient.id,
  name: typeof apiIngredient.name === 'object' ? apiIngredient.name.rendered : apiIngredient.name,
  slug: apiIngredient.slug,
  description: typeof apiIngredient.description === 'object' ? apiIngredient.description.rendered : apiIngredient.description,
  image: apiIngredient.image || apiIngredient._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  start_age: apiIngredient.start_age || '+6 Ay',
  benefits: apiIngredient.benefits || '',
  prep_methods: apiIngredient.prep_methods || [],
  allergy_risk: apiIngredient.allergy_risk || 'Düşük',
  season: apiIngredient.season || 'Tüm Yıl',
  storage_tips: apiIngredient.storage_tips,
  related_recipes: apiIngredient.related_recipes || [],
  faq: apiIngredient.faq || [],
});

export const ingredientService = {
  /**
   * Tüm malzemeleri getir
   */
  getAll: async (filters: IngredientFilters = {}): Promise<Ingredient[]> => {
    const { page = 1, perPage = 24, startAge, allergyRisk, season } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (startAge) params.append('start_age', startAge);
    if (allergyRisk) params.append('allergy_risk', allergyRisk);
    if (season) params.append('season', season);
    
    try {
      const response = await fetchAPI<any>(`${API_ENDPOINTS.INGREDIENTS}?${params.toString()}`);
      
      // Response format kontrolü
      if (Array.isArray(response)) {
        return response.map(transformIngredient);
      } else if (response && Array.isArray(response.data)) {
        return response.data.map(transformIngredient);
      } else if (response && Array.isArray(response.ingredients)) {
        return response.ingredients.map(transformIngredient);
      }
      
      console.warn('Unexpected API response format:', response);
      return [];
    } catch (error) {
      console.error('Ingredient fetch error:', error);
      return [];
    }
  },

  /**
   * Tekil malzeme detayı (slug ile)
   */
  getBySlug: async (slug: string): Promise<Ingredient | null> => {
    try {
      return await fetchAPI<Ingredient>(API_ENDPOINTS.INGREDIENT_BY_SLUG(slug));
    } catch (error) {
      console.error('Ingredient fetch error:', error);
      return null;
    }
  },

  /**
   * Malzeme arama (Ek gıda rehberi için)
   */
  search: async (query: string): Promise<Ingredient[]> => {
    return await fetchAPI<Ingredient[]>(`${API_ENDPOINTS.INGREDIENTS_SEARCH}?q=${encodeURIComponent(query)}`);
  },
};