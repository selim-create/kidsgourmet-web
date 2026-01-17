import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { RecipeCard } from '@/lib/types';

export interface SuggestedFood {
  ingredient_name: string;
  ingredient_slug: string;
  ingredient_id: number;
  start_age_months: number;
  reasons: string[];
  priority: 'high' | 'medium' | 'low';
  category: string;
  recipes: RecipeCard[];
}

export interface NextFoodSuggestion {
  ingredient_name: string;
  ingredient_slug: string;
  ingredient_id: number;
  introduction_week: string;
  preparation_tips: string[];
  allergy_info?: string;
  recipes: RecipeCard[];
}

export const foodIntroductionService = {
  /**
   * Önerilen besinler listesi
   */
  getSuggestedFoods: async (childId: string): Promise<SuggestedFood[]> => {
    try {
      if (!childId) return [];
      
      const response = await fetchAuthAPI<SuggestedFood[] | { foods?: SuggestedFood[]; data?: SuggestedFood[] }>(
        `${API_ENDPOINTS.FOOD_INTRODUCTION_SUGGESTED}?child_id=${childId}`
      );
      
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.foods)) return response.foods;
      if (Array.isArray(response?.data)) return response.data;
      
      return [];
    } catch (error) {
      console.error('getSuggestedFoods failed:', error);
      return [];
    }
  },
  
  /**
   * Sonraki öneri (bu hafta denenebilecek)
   */
  getNextSuggestion: async (childId: string): Promise<NextFoodSuggestion | null> => {
    try {
      if (!childId) return null;
      
      const response = await fetchAuthAPI<NextFoodSuggestion | { suggestion?: NextFoodSuggestion; data?: NextFoodSuggestion } | null>(
        `${API_ENDPOINTS.FOOD_INTRODUCTION_NEXT}?child_id=${childId}`
      );
      
      // Normalize response structure
      const data = response as any;
      const suggestion = data?.suggestion || data?.data || data || null;
      
      // Ensure preparation_tips is always an array
      if (suggestion && !Array.isArray(suggestion.preparation_tips)) {
        suggestion.preparation_tips = [];
      }
      
      return suggestion;
    } catch (error) {
      console.error('getNextSuggestion failed:', error);
      return null;
    }
  }
};
