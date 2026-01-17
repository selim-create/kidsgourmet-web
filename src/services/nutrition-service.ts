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
  ): Promise<WeeklyNutritionSummary | null> => {
    try {
      if (!childId) return null;
      
      const params = weekStart 
        ? `?child_id=${childId}&week_start=${weekStart}` 
        : `?child_id=${childId}`;
      
      const response = await fetchAuthAPI<WeeklyNutritionSummary>(
        `${API_ENDPOINTS.NUTRITION_WEEKLY_SUMMARY}${params}`
      );
      return response || null;
    } catch (error) {
      console.error('getWeeklySummary failed:', error);
      return null;
    }
  },
  
  /**
   * Eksik besinler
   */
  getMissingNutrients: async (childId: string): Promise<MissingNutrient[]> => {
    try {
      if (!childId) return [];
      
      const response = await fetchAuthAPI<MissingNutrient[] | { missing_nutrients?: MissingNutrient[]; data?: MissingNutrient[] }>(
        `${API_ENDPOINTS.NUTRITION_MISSING_NUTRIENTS}?child_id=${childId}`
      );
      
      // CRITICAL: Always return array
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.missing_nutrients)) return response.missing_nutrients;
      if (Array.isArray(response?.data)) return response.data;
      
      return [];
    } catch (error) {
      console.error('getMissingNutrients failed:', error);
      return []; // CRITICAL: Always return array on error
    }
  },
  
  /**
   * Çeşitlilik analizi
   */
  getVarietyAnalysis: async (
    childId: string, 
    days?: number
  ): Promise<VarietyAnalysis | null> => {
    try {
      if (!childId) return null;
      
      const daysParam = days || 7;
      const response = await fetchAuthAPI<VarietyAnalysis>(
        `${API_ENDPOINTS.NUTRITION_VARIETY_ANALYSIS}?child_id=${childId}&days=${daysParam}`
      );
      return response || null;
    } catch (error) {
      console.error('getVarietyAnalysis failed:', error);
      return null;
    }
  }
};
