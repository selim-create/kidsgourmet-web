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
        console.warn('Tariften API error:', response.status);
        return [];
      }
      
      const data = await response.json();
      return data.success ? data.recipes : [];
    } catch (error) {
      console.error('Tariften service error:', error);
      return [];
    }
  }
};
