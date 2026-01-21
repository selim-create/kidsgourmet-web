import { mutate } from 'swr';
import { recipeService } from '@/services/recipe-service';
import { ingredientService } from '@/services/ingredient-service';

/**
 * Popüler verileri önceden cache'e yükle
 * Layout veya sayfa component'lerinde kullanılabilir
 */
export async function prefetchPopularData() {
  // Featured recipes
  mutate(
    ['recipes', 'featured', 5],
    recipeService.getFeatured(5),
    { revalidate: false }
  );

  // Ingredient categories (nadiren değişir)
  mutate(
    ['ingredient-categories'],
    ingredientService.getCategories(),
    { revalidate: false }
  );

  // İlk sayfa tarifleri
  mutate(
    ['recipes', JSON.stringify({ page: 1, perPage: 12 })],
    recipeService.getAll({ page: 1, perPage: 12 }),
    { revalidate: false }
  );
}

/**
 * Belirli bir tarifi prefetch et (hover'da kullanılabilir)
 */
export function prefetchRecipe(slug: string) {
  mutate(
    ['recipe', slug],
    recipeService.getBySlug(slug),
    { revalidate: false }
  );
}

/**
 * Belirli bir malzemeyi prefetch et
 */
export function prefetchIngredient(slug: string) {
  mutate(
    ['ingredient', slug],
    ingredientService.getBySlug(slug),
    { revalidate: false }
  );
}
