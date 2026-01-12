import { fetchAPI } from '@/lib/api';
import { WP_API_NAMESPACE } from '@/lib/constants';
import type { Ingredient } from '@/lib/types';

export const ingredientService = {
    
    // Tüm malzemeleri getir
    getAll: async () => {
        return await fetchAPI<Ingredient[]>(`${WP_API_NAMESPACE}/ingredient?_embed&per_page=100`);
    },

    // Tekil malzeme detayı
    getBySlug: async (slug: string) => {
        const ingredients = await fetchAPI<Ingredient[]>(`${WP_API_NAMESPACE}/ingredient?slug=${slug}&_embed`);
        return ingredients.length > 0 ? ingredients[0] : null;
    },
    
    // Mevsimindeki malzemeleri getir (Custom Logic gerekebilir veya Taxonomy)
    getSeasonal: async (month: number) => {
        // Backend'de bu filtreleme mantığı henüz yoksa, tümünü çekip burada da filtreleyebiliriz
        // veya özel bir endpoint yazabiliriz. Şimdilik standart çekiyoruz.
        return await fetchAPI<Ingredient[]>(`${WP_API_NAMESPACE}/ingredient?_embed&per_page=6`);
    }
};