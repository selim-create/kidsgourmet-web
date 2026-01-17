import { TariftenRecipe } from '@/lib/types';
import { TARIFTEN_API_URL } from '@/lib/constants';

export const tariftenService = {
  /**
   * Malzemeye göre Tariften.com'dan tarif önerileri al
   */
  getByIngredient: async (ingredient: string, limit: number = 3): Promise<TariftenRecipe[]> => {
    try {
      const response = await fetch(
        `${TARIFTEN_API_URL}/recipes/by-ingredient?ingredient=${encodeURIComponent(ingredient)}&limit=${limit}`,
        { 
          next: { revalidate: 3600 }, // 1 saat cache
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (!response.ok) {
        // Gracefully handle API errors without logging to console
        return [];
      }
      
      const data = await response.json();
      return data.success ? data.recipes : [];
    } catch (error) {
      // Silently fail and return empty array - this is expected when API is unavailable
      return [];
    }
  },

  /**
   * Get random recipe - use alternative method if API endpoint is not available
   */
  getRandom: async (): Promise<TariftenRecipe | null> => {
    try {
      // API endpoint (/recipes/random) not available - returns 404
      // Alternative: fetch recipe using popular ingredients
      const popularIngredients = ['havuç', 'patates', 'tavuk', 'yumurta', 'elma', 'kabak', 'brokoli'];
      const randomIngredient = popularIngredients[Math.floor(Math.random() * popularIngredients.length)];
      
      const recipes = await tariftenService.getByIngredient(randomIngredient, 1);
      return recipes.length > 0 ? recipes[0] : null;
    } catch {
      // Silently handle errors when fallback ingredient-based API call fails
      return null;
    }
  }
};
