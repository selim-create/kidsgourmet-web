import Script from 'next/script';

// Organization JSON-LD for the whole site
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KidsGourmet',
    url: 'https://kidsgourmet.com.tr',
    logo: 'https://kidsgourmet.com.tr/logo.png',
    description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman onaylı tarifler, beslenme rehberleri ve akıllı araçlar.',
    sameAs: [
      'https://www.facebook.com/kidsgourmet',
      'https://www.instagram.com/kidsgourmet',
      'https://twitter.com/kidsgourmet',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@kidsgourmet.com.tr',
      availableLanguage: 'Turkish',
    },
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Website JSON-LD with SearchAction
export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KidsGourmet',
    url: 'https://kidsgourmet.com.tr',
    description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman onaylı tarifler ve beslenme rehberleri.',
    inLanguage: 'tr-TR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kidsgourmet.com.tr/arama?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Recipe JSON-LD for recipe pages
interface RecipeJsonLdProps {
  name: string;
  description: string;
  image: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  keywords?: string[];
  ingredients?: string[];
  instructions?: Array<{
    text: string;
    name?: string;
  }>;
  nutrition?: {
    calories?: string;
    proteinContent?: string;
    fatContent?: string;
    carbohydrateContent?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
  author?: {
    name: string;
    type?: string;
  };
  datePublished?: string;
}

export function RecipeJsonLd(props: RecipeJsonLdProps) {
  const {
    name,
    description,
    image,
    prepTime,
    cookTime,
    totalTime,
    recipeYield,
    recipeCategory,
    recipeCuisine,
    keywords,
    ingredients,
    instructions,
    nutrition,
    aggregateRating,
    author,
    datePublished,
  } = props;

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name,
    description,
    image: image || 'https://kidsgourmet.com.tr/default-recipe.jpg',
  };

  if (prepTime) jsonLd.prepTime = prepTime;
  if (cookTime) jsonLd.cookTime = cookTime;
  if (totalTime) jsonLd.totalTime = totalTime;
  if (recipeYield) jsonLd.recipeYield = recipeYield;
  if (recipeCategory) jsonLd.recipeCategory = recipeCategory;
  if (recipeCuisine) jsonLd.recipeCuisine = recipeCuisine;
  if (keywords) jsonLd.keywords = keywords.join(', ');

  if (ingredients && ingredients.length > 0) {
    jsonLd.recipeIngredient = ingredients;
  }

  if (instructions && instructions.length > 0) {
    jsonLd.recipeInstructions = instructions.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step.text,
      name: step.name || `Adım ${index + 1}`,
    }));
  }

  if (nutrition) {
    jsonLd.nutrition = {
      '@type': 'NutritionInformation',
      ...nutrition,
    };
  }

  if (aggregateRating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
    };
  }

  if (author) {
    jsonLd.author = {
      '@type': author.type || 'Person',
      name: author.name,
    };
  }

  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  return (
    <Script
      id="recipe-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Article JSON-LD for blog posts
interface ArticleJsonLdProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    type?: string;
  };
  publisher?: {
    name: string;
    logo: string;
  };
  keywords?: string[];
}

export function ArticleJsonLd(props: ArticleJsonLdProps) {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher,
    keywords,
  } = props;

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': author.type || 'Person',
      name: author.name,
    },
    publisher: publisher || {
      '@type': 'Organization',
      name: 'KidsGourmet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kidsgourmet.com.tr/logo.png',
      },
    },
  };

  if (keywords && keywords.length > 0) {
    jsonLd.keywords = keywords.join(', ');
  }

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb JSON-LD
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// FAQ JSON-LD
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  faqs: FAQItem[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
