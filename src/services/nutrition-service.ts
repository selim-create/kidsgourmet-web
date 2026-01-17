import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface WeeklyNutritionSummary {
  protein_servings: number;
  vegetable_servings: number;
  fruit_servings: number;
  grains_servings: number;
  dairy_servings: number;
  iron_rich_count: number;
  variety_score: number;
  week_start: string;
  week_end: string;
}

export interface MissingNutrient {
  nutrient: string;
  current_servings: number;
  recommended_servings: number;
  deficit_percentage: number;
  suggested_foods: string[];
}

export interface VarietyAnalysis {
  variety_score: number;
  unique_ingredients_count: number;
  repeated_meals_count: number;
  suggestions: string[];
  color_diversity?: {
    score: number;
    missing_colors: string[];
  };
}

export const nutritionService = {
  /**
   * Haftalık beslenme özeti
   */
  getWeeklySummary: async (
    childId: string, 
    weekStart?: string
  ): Promise<WeeklyNutritionSummary> => {
    const params = weekStart 
      ? `?child_id=${childId}&week_start=${weekStart}` 
      : `?child_id=${childId}`;
    
    return await fetchAuthAPI<WeeklyNutritionSummary>(
      `${API_ENDPOINTS.NUTRITION_WEEKLY_SUMMARY}${params}`
    );
  },
  
  /**
   * Eksik besinler
   */
  getMissingNutrients: async (childId: string): Promise<MissingNutrient[]> => {
    return await fetchAuthAPI<MissingNutrient[]>(
      `${API_ENDPOINTS.NUTRITION_MISSING_NUTRIENTS}?child_id=${childId}`
    );
  },
  
  /**
   * Çeşitlilik analizi
   */
  getVarietyAnalysis: async (
    childId: string, 
    days?: number
  ): Promise<VarietyAnalysis> => {
    const daysParam = days || 7;
    return await fetchAuthAPI<VarietyAnalysis>(
      `${API_ENDPOINTS.NUTRITION_VARIETY_ANALYSIS}?child_id=${childId}&days=${daysParam}`
    );
  }
};
