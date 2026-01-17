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
    return await fetchAuthAPI<SuggestedFood[]>(
      `${API_ENDPOINTS.FOOD_INTRODUCTION_SUGGESTED}?child_id=${childId}`
    );
  },
  
  /**
   * Sonraki öneri (bu hafta denenebilecek)
   */
  getNextSuggestion: async (childId: string): Promise<NextFoodSuggestion | null> => {
    return await fetchAuthAPI<NextFoodSuggestion | null>(
      `${API_ENDPOINTS.FOOD_INTRODUCTION_NEXT}?child_id=${childId}`
    );
  }
};
