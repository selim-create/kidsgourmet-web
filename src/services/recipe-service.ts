import { fetchAPI } from '@/lib/api';
import { WP_API_NAMESPACE } from '@/lib/constants';

// Backend'den gelen veri yapısına uygun tip tanımı
export interface Recipe {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
  // ACF veya özel alanlar (Backend'de tanımladığınız meta key'lere göre)
  acf?: {
    prep_time?: string;
    age_group?: string;
    calories?: string;
    is_vegan?: boolean;
  };
}

export const recipeService = {
  
  // Tüm tarifleri getir (Sayfalama ve Filtreleme ile)
  getAll: async (page = 1, perPage = 12, filters?: any) => {
    // Standart WP Custom Post Type endpoint'i: /wp/v2/recipe
    // Eğer backend'de CPT adını 'recipe' yaptıysanız bu çalışır.
    let endpoint = `${WP_API_NAMESPACE}/recipe?page=${page}&per_page=${perPage}&_embed`;

    // Filtreleme mantığı (Örnek: Kategori/Taxonomy ID'si ekleme)
    // Gerçek senaryoda backend'in desteklediği parametreleri buraya eklemelisiniz.
    if (filters?.ageGroup) {
      // endpoint += `&age-group=${filters.ageGroup}`; 
    }

    return await fetchAPI<Recipe[]>(endpoint);
  },

  // Tekil tarif detayı
  getBySlug: async (slug: string) => {
    const recipes = await fetchAPI<Recipe[]>(`${WP_API_NAMESPACE}/recipe?slug=${slug}&_embed`);
    return recipes.length > 0 ? recipes[0] : null;
  }
};