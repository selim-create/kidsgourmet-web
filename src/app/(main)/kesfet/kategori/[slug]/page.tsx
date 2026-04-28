import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';
import { blogService } from '@/services/blog-service';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const categories = await blogService.getCategories();
    const category = (categories || []).find((c: { slug: string }) => c.slug === slug);

    const name = category?.name || slug;
    const description = category?.description
      || `${name} kategorisindeki bebek ve çocuk beslenmesi rehberleri, tarifler ve uzman önerileri.`;
    const title = `${name} - KidsGourmet`;
    const url = `${SITE_URL}/kesfet/kategori/${slug}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: 'KidsGourmet',
        locale: 'tr_TR',
        type: 'website',
      },
    };
  } catch {
    const url = `${SITE_URL}/kesfet/kategori/${slug}`;
    return {
      alternates: { canonical: url },
    };
  }
}

export default function BlogCategoryPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  return <CategoryPageClient params={params} />;
}
