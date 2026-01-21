import useSWR from 'swr';
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';

// Field definitions for different views
const INGREDIENT_LIST_FIELDS = 'id,title,slug,image,start_age,allergy_risk';
const INGREDIENT_CARD_FIELDS = 'id,title,slug,image,start_age';

interface IngredientsFilters {
  page?: number;
  perPage?: number;
  category?: string;
  allergyRisk?: string;
  season?: string;
  startAge?: string;
  fields?: 'list' | 'card' | 'full';
}

interface IngredientsResponse {
  ingredients: Ingredient[];
  total: number;
  pages: number;
}

export function useIngredients(filters?: IngredientsFilters) {
  const { fields, ...serviceFilters } = filters || {};
  
  // Build enhanced filters with sparse fieldsets
  const enhancedFilters: any = {
    ...serviceFilters,
  };
  
  // Add sparse fieldsets if specified
  if (fields) {
    const fieldSet = fields === 'list' ? INGREDIENT_LIST_FIELDS :
                     fields === 'card' ? INGREDIENT_CARD_FIELDS : '';
    if (fieldSet) {
      enhancedFilters.fields = fieldSet;
    }
  }
  
  const key = enhancedFilters ? ['ingredients', JSON.stringify(enhancedFilters)] : ['ingredients'];
  
  return useSWR<IngredientsResponse | Ingredient[]>(
    key,
    () => ingredientService.getAll(enhancedFilters),
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
