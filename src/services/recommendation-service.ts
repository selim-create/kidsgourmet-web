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
    return await fetchAuthAPI<DashboardRecommendations>(
      `${API_ENDPOINTS.RECOMMENDATIONS_DASHBOARD}?child_id=${childId}`
    );
  },
  
  /**
   * Kişiselleştirilmiş tarifler
   */
  getPersonalizedRecipes: async (
    childId: string, 
    options?: PersonalizedRecipesOptions
  ): Promise<PersonalizedRecipe[]> => {
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
    
    return await fetchAuthAPI<PersonalizedRecipe[]>(
      `${API_ENDPOINTS.RECOMMENDATIONS_RECIPES}?${params.toString()}`
    );
  },
  
  /**
   * Benzer güvenli tarifler
   */
  getSimilarSafeRecipes: async (recipeId: number, childId: string): Promise<RecipeCard[]> => {
    return await fetchAuthAPI<RecipeCard[]>(
      `${API_ENDPOINTS.RECOMMENDATIONS_SIMILAR(recipeId)}?child_id=${childId}`
    );
  }
};
