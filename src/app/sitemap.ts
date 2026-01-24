import { MetadataRoute } from 'next';
import { recipeService } from '@/services/recipe-service';
import { blogService } from '@/services/blog-service';

const BASE_URL = 'https://kidsgourmet.com.tr';

// Static routes that don't change
const staticRoutes: MetadataRoute.Sitemap = [
  // Main pages
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/kesfet`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/kategoriler`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/tarifler`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/beslenme-rehberi`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/akilli-asistan`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/uzmanlar`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/arama`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/yardim`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/iletisim`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/reklam-verin`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },

  // Age group pages
  {
    url: `${BASE_URL}/06-12-ay-yemek`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/1-yas-ustu-yemek`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },

  // Smart assistant tools
  {
    url: `${BASE_URL}/akilli-asistan/blw-testi`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/persentil`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/su-ihtiyaci`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/ek-gida-rehberi`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/ek-gidaya-baslama`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/bu-gida-verilir-mi`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/alerjen-planlayici`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/besin-takvimi`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/akilli-asistan/hava-kalitesi`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/akilli-asistan/bez-hesaplayici`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/akilli-asistan/banyo-planlayici`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/akilli-asistan/leke-rehberi`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },

  // Nutrition guide sub-pages
  {
    url: `${BASE_URL}/beslenme-rehberi/alerji-belirtileri`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/beslenme-rehberi/sunum-onerileri`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },

  // Legal pages
  {
    url: `${BASE_URL}/gizlilik-politikasi`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/kullanim-kosullari`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/cerez-politikasi`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/aydinlatma-metni`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/kvkk`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/kunye`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [...staticRoutes];

  try {
    // Fetch dynamic recipes
    // Get all recipes with pagination (fetch first 1000 recipes maximum)
    const recipesPerPage = 100;
    let currentPage = 1;
    let hasMoreRecipes = true;

    while (hasMoreRecipes && currentPage <= 10) {
      try {
        const recipesResponse = await recipeService.getAll({
          page: currentPage,
          perPage: recipesPerPage,
        });

        if (recipesResponse.recipes && recipesResponse.recipes.length > 0) {
          recipesResponse.recipes.forEach((recipe) => {
            sitemapEntries.push({
              url: `${BASE_URL}/tarifler/${recipe.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          });

          // Check if there are more pages
          hasMoreRecipes = currentPage < recipesResponse.total_pages;
          currentPage++;
        } else {
          hasMoreRecipes = false;
        }
      } catch (error) {
        console.error(`Error fetching recipes page ${currentPage}:`, error);
        hasMoreRecipes = false;
      }
    }
  } catch (error) {
    console.error('Error fetching recipes for sitemap:', error);
  }

  try {
    // Fetch dynamic blog posts with lightweight endpoint
    let currentPage = 1;
    let hasMorePosts = true;

    while (hasMorePosts && currentPage <= 20) {  // 20 sayfaya çıkar (50x20=1000 post)
      try {
        // Hafif endpoint kullan - sadece id, slug, date çeker
        const blogResponse = await blogService.getSitemapPosts(currentPage, 50);

        if (blogResponse.posts && blogResponse.posts.length > 0) {
          blogResponse.posts.forEach((post) => {
            sitemapEntries.push({
              url: `${BASE_URL}/kesfet/${post.slug}`,
              lastModified: post.date ? new Date(post.date) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.6,
            });
          });

          // Check if there are more pages
          hasMorePosts = currentPage < blogResponse.totalPages;
          currentPage++;
        } else {
          hasMorePosts = false;
        }
      } catch (error) {
        console.error(`Error fetching blog posts page ${currentPage}:`, error);
        hasMorePosts = false;
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  try {
    // Fetch blog categories
    interface CategoryType {
      id: number;
      slug: string;
      count: number;
      name: string;
    }

    const categories = await blogService.getCategories();
    
    if (categories && categories.length > 0) {
      categories.forEach((category: CategoryType) => {
        if (category.slug && category.count > 0) {
          sitemapEntries.push({
            url: `${BASE_URL}/kesfet/kategori/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  return sitemapEntries;
}
