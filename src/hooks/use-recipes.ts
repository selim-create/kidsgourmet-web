import useSWR from 'swr';
import { recipeService, RecipeFilters as ServiceRecipeFilters } from '@/services/recipe-service';
import { RecipeCard } from '@/lib/types';

// Field definitions for different views
const RECIPE_LIST_FIELDS = 'id,title,slug,image,prep_time,difficulty,rating,age_group,age_group_color';
const RECIPE_CARD_FIELDS = 'id,title,slug,image,prep_time,rating,age_group_color';
const RECIPE_DETAIL_FIELDS = ''; // Empty = all fields

interface RecipesResponse {
  recipes: RecipeCard[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface RecipeFilters extends ServiceRecipeFilters {
  fields?: 'list' | 'card' | 'full';
}

export function useRecipes(filters?: RecipeFilters) {
  const { fields, ...serviceFilters } = filters || {};
  
  // Build enhanced filters with sparse fieldsets
  const enhancedFilters: ServiceRecipeFilters & { fields?: string } = {
    ...serviceFilters,
  };
  
  // Add sparse fieldsets if specified
  if (fields) {
    const fieldSet = fields === 'list' ? RECIPE_LIST_FIELDS : 
                     fields === 'card' ? RECIPE_CARD_FIELDS : 
                     RECIPE_DETAIL_FIELDS;
    if (fieldSet) {
      enhancedFilters.fields = fieldSet;
    }
  }
  
  const key = enhancedFilters ? ['recipes', JSON.stringify(enhancedFilters)] : ['recipes'];
  
  return useSWR<RecipesResponse>(
    key,
    () => recipeService.getAll(enhancedFilters),
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
