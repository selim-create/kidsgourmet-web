import { TariftenRecipe } from '@/lib/types';

const TARIFTEN_API = 'https://api.tariften.com/wp-json/tariften/v1';

export const tariftenService = {
  /**
   * Malzemeye göre Tariften.com'dan tarif önerileri al
   */
  getByIngredient: async (ingredient: string, limit: number = 3): Promise<TariftenRecipe[]> => {
    try {
      const response = await fetch(
        `${TARIFTEN_API}/recipes/by-ingredient?ingredient=${encodeURIComponent(ingredient)}&limit=${limit}`,
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
