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

// Default safe result
const SAFE_RESULT: SafetyCheckResult = {
  is_safe: true,
  safety_score: 100,
  alerts: [],
  alternatives: [],
};

export const safetyService = {
  /**
   * Tarif güvenlik kontrolü
   * Enhanced with proper error propagation
   */
  checkRecipeSafety: async (
    recipeId: number, 
    childId: string
  ): Promise<SafetyCheckResult> => {
    if (!recipeId || !childId) return SAFE_RESULT;
    
    const response = await fetchAuthAPI<SafetyCheckResult>(
      API_ENDPOINTS.SAFETY_CHECK_RECIPE,
      {
        method: 'POST',
        body: JSON.stringify({ recipe_id: recipeId, child_id: childId })
      }
    );
    
    return {
      is_safe: response?.is_safe ?? true,
      safety_score: response?.safety_score ?? 100,
      alerts: Array.isArray(response?.alerts) ? response.alerts : [],
      alternatives: Array.isArray(response?.alternatives) ? response.alternatives : [],
      ingredient_checks: response?.ingredient_checks,
    };
  },
  
  /**
   * Malzeme güvenlik kontrolü
   * Enhanced with proper error propagation
   */
  checkIngredientSafety: async (
    ingredientId: number, 
    childId: string
  ): Promise<SafetyCheckResult> => {
    if (!ingredientId || !childId) return SAFE_RESULT;
    
    const response = await fetchAuthAPI<SafetyCheckResult>(
      API_ENDPOINTS.SAFETY_CHECK_INGREDIENT,
      {
        method: 'POST',
        body: JSON.stringify({ ingredient_id: ingredientId, child_id: childId })
      }
    );
    
    return {
      is_safe: response?.is_safe ?? true,
      safety_score: response?.safety_score ?? 100,
      alerts: Array.isArray(response?.alerts) ? response.alerts : [],
      alternatives: Array.isArray(response?.alternatives) ? response.alternatives : [],
    };
  },
  
  /**
   * Toplu güvenlik kontrolü (arama sonuçları için)
   */
  batchSafetyCheck: async (
    recipeIds: number[], 
    childId: string
  ): Promise<BatchSafetyResult> => {
    if (!Array.isArray(recipeIds) || recipeIds.length === 0 || !childId) {
      return {};
    }
    
    const response = await fetchAuthAPI<BatchSafetyResult | { results?: BatchSafetyResult }>(
      API_ENDPOINTS.SAFETY_BATCH_CHECK,
      {
        method: 'POST',
        body: JSON.stringify({ recipe_ids: recipeIds, child_id: childId })
      }
    );
    
    const data = response as any;
    return data?.results || data || {};
  }
};
