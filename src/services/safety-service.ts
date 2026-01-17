import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { RecipeCard } from '@/lib/types';

export interface SafetyAlert {
  type: 'allergy' | 'age' | 'forbidden' | 'nutrition';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  ingredient?: string;
  alternative?: string;
}

export interface SafetyCheckResult {
  is_safe: boolean;
  safety_score: number;
  alerts: SafetyAlert[];
  alternatives?: RecipeCard[];
  ingredient_checks?: Record<string, {
    is_safe: boolean;
    alerts: SafetyAlert[];
  }>;
}

export interface BatchSafetyResult {
  [recipeId: number]: {
    is_safe: boolean;
    safety_score: number;
    critical_alerts_count: number;
    warning_alerts_count: number;
  };
}

export const safetyService = {
  /**
   * Tarif güvenlik kontrolü
   */
  checkRecipeSafety: async (
    recipeId: number, 
    childId: string
  ): Promise<SafetyCheckResult> => {
    return await fetchAuthAPI<SafetyCheckResult>(
      API_ENDPOINTS.SAFETY_CHECK_RECIPE,
      {
        method: 'POST',
        body: JSON.stringify({ recipe_id: recipeId, child_id: childId })
      }
    );
  },
  
  /**
   * Malzeme güvenlik kontrolü
   */
  checkIngredientSafety: async (
    ingredientId: number, 
    childId: string
  ): Promise<SafetyCheckResult> => {
    return await fetchAuthAPI<SafetyCheckResult>(
      API_ENDPOINTS.SAFETY_CHECK_INGREDIENT,
      {
        method: 'POST',
        body: JSON.stringify({ ingredient_id: ingredientId, child_id: childId })
      }
    );
  },
  
  /**
   * Toplu güvenlik kontrolü (arama sonuçları için)
   */
  batchSafetyCheck: async (
    recipeIds: number[], 
    childId: string
  ): Promise<BatchSafetyResult> => {
    return await fetchAuthAPI<BatchSafetyResult>(
      API_ENDPOINTS.SAFETY_BATCH_CHECK,
      {
        method: 'POST',
        body: JSON.stringify({ recipe_ids: recipeIds, child_id: childId })
      }
    );
  }
};
