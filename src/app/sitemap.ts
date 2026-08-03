import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { recipeService } from '@/services/recipe-service';
import { blogService } from '@/services/blog-service';
import { ingredientService } from '@/services/ingredient-service';

const staticPaths = [
  '',
  '/kesfet',
  '/kategoriler',
  '/tarifler',
  '/beslenme-rehberi',
  '/akilli-asistan',
  '/uzmanlar',
  '/iletisim',
  '/reklam-verin',
  '/06-12-ay-yemek',
  '/1-yas-ustu-yemek',
  '/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek',
  '/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek',
  '/akilli-asistan/blw-testi',
  '/akilli-asistan/persentil',
  '/akilli-asistan/su-ihtiyaci',
  '/akilli-asistan/ek-gida-rehberi',
  '/akilli-asistan/ek-gidaya-baslama',
  '/akilli-asistan/bu-gida-verilir-mi',
  '/akilli-asistan/alerjen-planlayici',
  '/akilli-asistan/besin-takvimi',
  '/akilli-asistan/hava-kalitesi',
  '/akilli-asistan/bez-hesaplayici',
  '/akilli-asistan/banyo-planlayici',
  '/akilli-asistan/leke-rehberi',
  '/beslenme-rehberi/alerji-belirtileri',
  '/beslenme-rehberi/sunum-onerileri',
  '/gizlilik-politikasi',
  '/kullanim-kosullari',
  '/cerez-politikasi',
  '/aydinlatma-metni',
  '/kvkk',
  '/kunye',
] as const;

function entry(path: string, lastModified: Date = new Date()): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === '' || path === '/kesfet' || path === '/tarifler' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/kesfet' || path === '/tarifler' ? 0.9 : 0.6,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = staticPaths.map((path) => entry(path));

  try {
    for (let page = 1; page <= 20; page++) {
      const response = await blogService.getSitemapPosts(page, 100);
      for (const post of response.posts ?? []) {
        urls.push(entry(`/kesfet/${post.slug}`, post.date ? new Date(post.date) : new Date()));
      }
      if (page >= response.totalPages || !response.posts?.length) break;
    }
  } catch (error) {
    console.error('Blog sitemap generation failed:', error);
  }

  try {
    for (let page = 1; page <= 20; page++) {
      const response = await recipeService.getAll({ page, perPage: 100 });
      for (const recipe of response.recipes ?? []) {
        if (recipe.slug) urls.push(entry(`/tarifler/${recipe.slug}`));
      }
      if (page >= response.total_pages || !response.recipes?.length) break;
    }
  } catch (error) {
    console.error('Recipe sitemap generation failed:', error);
  }

  try {
    for (let page = 1; page <= 20; page++) {
      const response = await ingredientService.getAll({ page, perPage: 100 });
      const ingredients = Array.isArray(response) ? response : response.ingredients ?? [];
      for (const ingredient of ingredients) {
        if (ingredient.slug) urls.push(entry(`/beslenme-rehberi/${ingredient.slug}`));
      }
      const totalPages = Array.isArray(response) ? (ingredients.length === 100 ? page + 1 : page) : response.pages ?? page;
      if (page >= totalPages || !ingredients.length) break;
    }
  } catch (error) {
    console.error('Ingredient sitemap generation failed:', error);
  }

  try {
    const categories = await blogService.getCategories();
    for (const category of categories ?? []) {
      if (category.slug && category.count > 0) {
        urls.push(entry(`/kesfet/kategori/${category.slug}`));
      }
    }
  } catch (error) {
    console.error('Category sitemap generation failed:', error);
  }

  return Array.from(new Map(urls.map((item) => [item.url, item])).values());
}
