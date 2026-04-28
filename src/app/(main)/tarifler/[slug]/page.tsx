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

async function RecipeJsonLd({ slug }: { slug: string }) {
  try {
    const recipe = await recipeService.getBySlug(slug);
    if (!recipe) return null;

    const url = `${SITE_URL}/tarifler/${slug}`;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      description: (recipe.excerpt || recipe.content).replace(/<[^>]*>/g, '').substring(0, 300),
      image: recipe.image ? [recipe.image] : [],
      url,
      author: recipe.author
        ? { '@type': 'Person', name: recipe.author.name }
        : { '@type': 'Organization', name: 'KidsGourmet' },
      prepTime: recipe.prep_time ? `PT${recipe.prep_time.replace(/[^0-9]/g, '')}M` : undefined,
      cookTime: recipe.cook_time ? `PT${recipe.cook_time.replace(/[^0-9]/g, '')}M` : undefined,
      recipeYield: recipe.serving_size || '1 porsiyon',
      recipeCategory: recipe.meal_type || 'Bebek Yemeği',
      suitableForDiet: recipe.diet_types?.map((d) => d) || [],
      recipeIngredient: recipe.ingredients?.map((ing) =>
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ) || [],
      recipeInstructions: recipe.instructions?.map((step) => ({
        '@type': 'HowToStep',
        name: step.title,
        text: step.text.replace(/<[^>]*>/g, ''),
      })) || [],
      nutrition: recipe.nutrition
        ? {
            '@type': 'NutritionInformation',
            calories: recipe.nutrition.calories ? `${recipe.nutrition.calories} kcal` : undefined,
            proteinContent: recipe.nutrition.protein,
            carbohydrateContent: recipe.nutrition.carbs,
            fatContent: recipe.nutrition.fat,
            fiberContent: recipe.nutrition.fiber,
          }
        : undefined,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  } catch {
    return null;
  }
}

export default async function RecipeDetailPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <RecipeJsonLd slug={slug} />
      <RecipeDetailPage params={params} />
    </>
  );
}
