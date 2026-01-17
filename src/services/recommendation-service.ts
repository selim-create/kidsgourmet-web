import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Recipe } from '@/lib/types';

export interface DashboardRecommendationsResponse {
  today: Recipe[];
  weekly_plan_status: {
    has_plan: boolean;
    completion: number;
    filled_slots: number;
    total_slots: number;
  } | null;
  nutrition_summary: {
    protein_servings: number;
    vegetable_servings: number;
    fruit_servings: number;
    grains_servings: number;
    dairy_servings: number;
    iron_rich_count: number;
    variety_score: number;
    new_foods_introduced: string[];
    allergen_exposures: string[];
  } | null;
  alerts: any[];
}

// Legacy interface for backward compatibility
export interface DashboardRecommendations {
  daily_picks: Recipe[];
  trending: Recipe[];
  try_new_food?: {
    ingredient_name: string;
    ingredient_slug: string;
    recipes: Recipe[];
  };
  safety_alerts?: {
    count: number;
    recipes: Recipe[];
  };
}

export interface PersonalizedRecipesOptions {
  limit?: number;
  meal_type?: string;
  include_scores?: boolean;
}

export interface PersonalizedRecipe extends Recipe {
  score?: number;
  reasons?: string[];
  recipe_id?: number;
}

export const recommendationService = {
  /**
   * Dashboard önerileri - NEW API format with 'today' field
   */
  getDashboardRecommendations: async (childId: string): Promise<DashboardRecommendationsResponse> => {
    try {
      if (!childId) {
        return { today: [], weekly_plan_status: null, nutrition_summary: null, alerts: [] };
      }
      
      const response = await fetchAuthAPI<any>(
        `${API_ENDPOINTS.RECOMMENDATIONS_DASHBOARD}?child_id=${childId}`
      );
      
      // API Response'u doğru şekilde map et
      return {
        today: Array.isArray(response?.today) ? response.today : [],
        weekly_plan_status: response?.weekly_plan_status || null,
        nutrition_summary: response?.nutrition_summary || null,
        alerts: Array.isArray(response?.alerts) ? response.alerts : [],
      };
    } catch (error) {
      console.error('getDashboardRecommendations failed:', error);
      return { today: [], weekly_plan_status: null, nutrition_summary: null, alerts: [] };
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
      
      const response = await fetchAuthAPI<any>(
        `${API_ENDPOINTS.RECOMMENDATIONS_RECIPES}?${params.toString()}`
      );
      
      // Her iki response formatını da destekle
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.recommendations)) return response.recommendations;
      if (Array.isArray(response?.today)) return response.today;
      if (Array.isArray(response?.recipes)) return response.recipes;
      
      return [];
    } catch (error) {
      console.error('getPersonalizedRecipes failed:', error);
      return [];
    }
  },
  
  /**
   * Benzer güvenli tarifler
   */
  getSimilarSafeRecipes: async (recipeId: number, childId: string): Promise<Recipe[]> => {
    try {
      if (!recipeId || !childId) return [];
      
      // Endpoint'in doğru olduğundan emin ol
      const response = await fetchAuthAPI<any>(
        `${API_ENDPOINTS.RECOMMENDATIONS_SIMILAR(recipeId)}?child_id=${childId}`
      );
      
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.alternatives)) return response.alternatives;
      if (Array.isArray(response?.recipes)) return response.recipes;
      if (Array.isArray(response?.similar)) return response.similar;
      
      return [];
    } catch (error) {
      // Sessizce fail et - bu endpoint opsiyonel
      console.warn('getSimilarSafeRecipes failed (non-critical):', error);
      return [];
    }
  },
};
