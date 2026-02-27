import { Metadata } from 'next';
import RecipeDetailPage from './RecipeDetailClient';
import { recipeService } from '@/services/recipe-service';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const recipe = await recipeService.getBySlug(slug);
    if (!recipe) return {};

    const title = recipe.seo?.title || `${recipe.title} - KidsGourmet`;
    const description = recipe.seo?.description || (recipe.excerpt || recipe.content).replace(/<[^>]*>/g, '').substring(0, 160);
    const ogImage = recipe.seo?.og_image || recipe.image;
    const url = `${SITE_URL}/tarifler/${slug}`;

    return {
      title,
      description,
      keywords: recipe.seo?.focus_keywords,
      openGraph: {
        title,
        description,
        url,
        siteName: 'KidsGourmet',
        locale: 'tr_TR',
        type: 'article',
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : [],
        creator: '@kidsgourmet',
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
    return {};
  }
}

export default function RecipeDetailPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  return <RecipeDetailPage params={params} />;
}
