import useSWR from 'swr';
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';

interface IngredientsFilters {
  page?: number;
  perPage?: number;
  category?: string;
  allergyRisk?: string;
  season?: string;
  startAge?: string;
}

interface IngredientsResponse {
  ingredients: Ingredient[];
  total: number;
  pages: number;
}

export function useIngredients(filters?: IngredientsFilters) {
  const key = filters ? ['ingredients', JSON.stringify(filters)] : ['ingredients'];
  
  return useSWR<IngredientsResponse | Ingredient[]>(
    key,
    () => ingredientService.getAll(filters || {}),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );
}

export function useIngredient(slug: string) {
  return useSWR(
    slug ? ['ingredient', slug] : null,
    () => ingredientService.getBySlug(slug),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );
}

export function useIngredientCategories() {
  return useSWR(
    ['ingredient-categories'],
    () => ingredientService.getCategories(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 saat (kategoriler nadiren değişir)
    }
  );
}

export function useIngredientSearch(query: string) {
  return useSWR(
    query && query.length >= 2 ? ['ingredients', 'search', query] : null,
    () => ingredientService.search(query),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 saniye (arama sonuçları)
    }
  );
}
