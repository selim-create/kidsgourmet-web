import { mutate } from 'swr';
import { recipeService } from '@/services/recipe-service';
import { ingredientService } from '@/services/ingredient-service';

/**
 * Popüler verileri önceden cache'e yükle.
 * Bu fonksiyon açıkça çağrıldığında çalışır; hover bazlı origin istekleri üretmez.
 */
export async function prefetchPopularData() {
  mutate(
    ['recipes', 'featured', 5],
    recipeService.getFeatured(5),
    { revalidate: false }
  );

  mutate(
    ['ingredient-categories'],
    ingredientService.getCategories(),
    { revalidate: false }
  );

  mutate(
    ['recipes', JSON.stringify({ page: 1, perPage: 12 })],
    recipeService.getAll({ page: 1, perPage: 12 }),
    { revalidate: false }
  );
}

/**
 * Detay sayfası hover prefetch'i bilinçli olarak devre dışı.
 * Kart üzerinde fare gezdirmenin WordPress origin'ine istek üretmesini engeller.
 */
export function prefetchRecipe(_slug: string) {
  return;
}

/**
 * Detay sayfası hover prefetch'i bilinçli olarak devre dışı.
 */
export function prefetchIngredient(_slug: string) {
  return;
}
