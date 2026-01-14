import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { 
  MealPlan, 
  GeneratePlanRequest, 
  GeneratePlanResponse,
  GenerateShoppingListResponse,
  SkipReason
} from '@/lib/types';

export const mealPlanService = {
  /**
   * Yeni haftalık plan oluştur (AI)
   */
  generatePlan: async (data: GeneratePlanRequest): Promise<GeneratePlanResponse> => {
    return await fetchAuthAPI<GeneratePlanResponse>(API_ENDPOINTS.MEAL_PLANS_GENERATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Aktif planı getir
   * Plan yoksa null döner (404 beklenen bir durum)
   */
  getActivePlan: async (childId: string): Promise<MealPlan | null> => {
    try {
      const response = await fetchAuthAPI<{ success: boolean; plan: MealPlan }>(
        API_ENDPOINTS.MEAL_PLANS_ACTIVE(childId),
        {},
        [404] // 404 beklenen bir durum - konsola log atma
      );
      return response?.plan || null;
    } catch (error: any) {
      // 404 = Plan yok, bu beklenen bir durum
      if (error?.message?.includes('404') || error?.message?.includes('No active plan')) {
        return null;
      }
      // Diğer hatalar için log at ama null dön
      console.warn('Active plan fetch warning:', error?.message);
      return null;
    }
  },

  /**
   * Plan detayı
   */
  getPlanById: async (planId: string): Promise<MealPlan> => {
    const response = await fetchAuthAPI<{ success: boolean; plan: MealPlan }>(
      API_ENDPOINTS.MEAL_PLAN_BY_ID(planId)
    );
    return response.plan;
  },

  /**
   * Slot'taki tarifi yenile
   */
  refreshSlot: async (planId: string, slotId: string): Promise<MealPlan> => {
    const response = await fetchAuthAPI<{ success: boolean; plan: MealPlan }>(
      API_ENDPOINTS.MEAL_PLAN_REFRESH_SLOT(planId, slotId),
      { method: 'PUT' }
    );
    return response.plan;
  },

  /**
   * Slot'u atla (dışarıdayız, hazır mama vs.)
   */
  skipSlot: async (
    planId: string, 
    slotId: string, 
    reason: SkipReason
  ): Promise<MealPlan> => {
    const response = await fetchAuthAPI<{ success: boolean; plan: MealPlan }>(
      API_ENDPOINTS.MEAL_PLAN_SKIP_SLOT(planId, slotId),
      { 
        method: 'PUT',
        body: JSON.stringify({ reason }),
      }
    );
    return response.plan;
  },

  /**
   * Alışveriş listesi oluştur
   */
  generateShoppingList: async (planId: string): Promise<GenerateShoppingListResponse> => {
    return await fetchAuthAPI<GenerateShoppingListResponse>(
      API_ENDPOINTS.MEAL_PLAN_SHOPPING_LIST(planId),
      { method: 'POST' }
    );
  },
};
