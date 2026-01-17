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
   * Rastgele tarif al - API endpoint mevcut değilse alternatif yöntem kullan
   */
  getRandom: async (): Promise<TariftenRecipe | null> => {
    try {
      // API endpoint (/recipes/random) mevcut değil - 404 dönüyor
      // Alternatif: popüler malzemelerle tarif getir
      const popularIngredients = ['havuç', 'patates', 'tavuk', 'yumurta', 'elma', 'kabak', 'brokoli'];
      const randomIngredient = popularIngredients[Math.floor(Math.random() * popularIngredients.length)];
      
      const recipes = await tariftenService.getByIngredient(randomIngredient, 1);
      return recipes.length > 0 ? recipes[0] : null;
    } catch {
      // Silently fail - API unavailable
      return null;
    }
  }
};
