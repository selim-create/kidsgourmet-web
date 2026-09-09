import { TariftenRecipe } from '@/lib/types';

export const tariftenService = {
  /**
   * Malzemeye göre Tariften.com'dan tarif önerileri al.
   * Browser doğrudan WordPress origin'ine gitmez; same-origin BFF cache kullanılır.
   */
  getByIngredient: async (ingredient: string, limit: number = 3): Promise<TariftenRecipe[]> => {
    try {
      const response = await fetch(
        `/api/external/tariften?ingredient=${encodeURIComponent(ingredient)}&limit=${limit}`,
        { cache: 'default' }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.success ? data.recipes : [];
    } catch {
      return [];
    }
  },

  /**
   * Rastgele tarif için popüler malzemelerden birini seç.
   */
  getRandom: async (): Promise<TariftenRecipe | null> => {
    try {
      const popularIngredients = ['havuç', 'patates', 'tavuk', 'yumurta', 'elma', 'kabak', 'brokoli'];
      const randomIngredient = popularIngredients[Math.floor(Math.random() * popularIngredients.length)];

      const recipes = await tariftenService.getByIngredient(randomIngredient, 1);
      return recipes.length > 0 ? recipes[0] : null;
    } catch {
      return null;
    }
  }
};
