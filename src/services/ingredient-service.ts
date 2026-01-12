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
    
    return await fetchAPI<Ingredient[]>(`${API_ENDPOINTS.INGREDIENTS}?${params.toString()}`);
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