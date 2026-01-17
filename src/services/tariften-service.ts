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
   * Rastgele tarif al
   */
  getRandom: async (): Promise<TariftenRecipe | null> => {
    try {
      const response = await fetch(
        `${TARIFTEN_API_URL}/recipes/random`,
        { 
          next: { revalidate: 1800 }, // 30 dakika cache
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (!response.ok) {
        // Gracefully handle API errors without logging to console
        return null;
      }
      
      const data = await response.json();
      return data.success && data.recipe ? data.recipe : null;
    } catch (error) {
      // Silently fail and return null - this is expected when API is unavailable
      return null;
    }
  }
};
