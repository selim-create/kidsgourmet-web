import { Metadata } from 'next';
import IngredientDetailPage from './IngredientDetailClient';
import { ingredientService } from '@/services/ingredient-service';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const ingredient = await ingredientService.getBySlug(slug);
    if (!ingredient) return {};

    const title = ingredient.seo?.title || `${ingredient.name} - Malzeme Rehberi - KidsGourmet`;
    const description = ingredient.seo?.description || ingredient.description.replace(/<[^>]*>/g, '').substring(0, 160);
    const ogImage = ingredient.seo?.og_image || ingredient.image;
    const url = `${SITE_URL}/beslenme-rehberi/${slug}`;

    return {
      title,
      description,
      keywords: ingredient.seo?.focus_keywords,
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

export default function IngredientDetailPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  return <IngredientDetailPage params={params} />;
}
