import { unstable_cache } from 'next/cache';
import { blogService } from '@/services/blog-service';
import { recipeService } from '@/services/recipe-service';
import { ingredientService } from '@/services/ingredient-service';

/**
 * Shared server-side caches for public content detail reads.
 *
 * Next.js RSC prefetches, metadata generation and JSON-LD rendering can all
 * request the same public WordPress resource. Caching here keeps those Vercel
 * render paths from repeatedly reaching the shared WordPress/PHP origin.
 */
export const getCachedBlogPost = unstable_cache(
  async (slug: string) => blogService.getBySlug(slug),
  ['kg-public-blog-detail'],
  { revalidate: 300 }
);

export const getCachedRecipe = unstable_cache(
  async (slug: string) => recipeService.getBySlug(slug),
  ['kg-public-recipe-detail'],
  { revalidate: 300 }
);

export const getCachedIngredient = unstable_cache(
  async (slug: string) => ingredientService.getBySlug(slug),
  ['kg-public-ingredient-detail'],
  { revalidate: 300 }
);
