import useSWR from 'swr';
import { recipeService, RecipeFilters } from '@/services/recipe-service';
import { RecipeCard } from '@/lib/types';

interface RecipesResponse {
  recipes: RecipeCard[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export function useRecipes(filters?: RecipeFilters) {
  const key = filters ? ['recipes', JSON.stringify(filters)] : ['recipes'];
  
  return useSWR<RecipesResponse>(
    key,
    () => recipeService.getAll(filters || {}),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 dakika dedupe
      keepPreviousData: true,
    }
  );
}

export function useRecipe(slug: string) {
  return useSWR(
    slug ? ['recipe', slug] : null,
    () => recipeService.getBySlug(slug),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 dakika (detay sayfası daha uzun cache)
    }
  );
}

export function useFeaturedRecipes(limit: number = 5) {
  return useSWR(
    ['recipes', 'featured', limit],
    () => recipeService.getFeatured(limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}

export function useRelatedRecipes(recipeId: number, limit: number = 4) {
  return useSWR(
    recipeId ? ['recipes', 'related', recipeId, limit] : null,
    () => recipeService.getRelated(recipeId, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );
}
