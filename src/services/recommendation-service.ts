import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { RecipeCard } from '@/lib/types';

export interface DashboardRecommendations {
  daily_picks: RecipeCard[];
  trending: RecipeCard[];
  try_new_food?: {
    ingredient_name: string;
    ingredient_slug: string;
    recipes: RecipeCard[];
  };
  safety_alerts?: {
    count: number;
    recipes: RecipeCard[];
  };
}

export interface PersonalizedRecipesOptions {
  limit?: number;
  meal_type?: string;
  include_scores?: boolean;
}

export interface PersonalizedRecipe extends RecipeCard {
  score?: number;
  reasons?: string[];
}

export const recommendationService = {
  /**
   * Dashboard önerileri
   */
  getDashboardRecommendations: async (childId: string): Promise<DashboardRecommendations> => {
    try {
      if (!childId) {
        return { daily_picks: [], trending: [] };
      }
      
      const response = await fetchAuthAPI<DashboardRecommendations>(
        `${API_ENDPOINTS.RECOMMENDATIONS_DASHBOARD}?child_id=${childId}`
      );
      
      return {
        daily_picks: Array.isArray(response?.daily_picks) ? response.daily_picks : [],
        trending: Array.isArray(response?.trending) ? response.trending : [],
        try_new_food: response?.try_new_food,
        safety_alerts: response?.safety_alerts,
      };
    } catch (error) {
      console.error('getDashboardRecommendations error:', error);
      return {
        daily_picks: [],
        trending: [],
      };
    }
  },
  
  /**
   * Kişiselleştirilmiş tarifler
   */
  getPersonalizedRecipes: async (
    childId: string, 
    options?: PersonalizedRecipesOptions
  ): Promise<PersonalizedRecipe[]> => {
    try {
      if (!childId) return [];
      
      const params = new URLSearchParams({ child_id: childId });
      
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options?.meal_type) {
        params.append('meal_type', options.meal_type);
      }
      if (options?.include_scores !== undefined) {
        params.append('include_scores', options.include_scores.toString());
      }
      
      const response = await fetchAuthAPI<PersonalizedRecipe[] | { recommendations: PersonalizedRecipe[] }>(
        `${API_ENDPOINTS.RECOMMENDATIONS_RECIPES}?${params.toString()}`
      );
      
      // Normalize API response structure - can be array or {recommendations: []}
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.recommendations)) return response.recommendations;
      if (Array.isArray((response as any)?.data)) return (response as any).data;
      
      return [];
    } catch (error) {
      console.error('getPersonalizedRecipes error:', error);
      return [];
    }
  },
  
  /**
   * Benzer güvenli tarifler
   */
  getSimilarSafeRecipes: async (recipeId: number, childId: string): Promise<RecipeCard[]> => {
    try {
      if (!recipeId || !childId) return [];
      
      const response = await fetchAuthAPI<RecipeCard[] | { alternatives?: RecipeCard[]; recipes?: RecipeCard[]; data?: RecipeCard[] }>(
        `${API_ENDPOINTS.RECOMMENDATIONS_SIMILAR(recipeId)}?child_id=${childId}`
      );
      
      // CRITICAL: Handle all possible response structures
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.alternatives)) return response.alternatives;
      if (Array.isArray(response?.recipes)) return response.recipes;
      if (Array.isArray(response?.data)) return response.data;
      
      return [];
    } catch (error) {
      // CRITICAL: Silent fail with empty array
      console.error('getSimilarSafeRecipes error:', error);
      return [];
    }
  }
};
