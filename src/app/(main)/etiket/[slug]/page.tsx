import { Metadata } from 'next';
import TagPageClient from './TagPageClient';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const url = `${SITE_URL}/etiket/${slug}`;
  const title = `#${slug} Etiketi - KidsGourmet`;
  const description = `KidsGourmet'te "${slug}" etiketiyle ilgili bebek ve çocuk beslenmesi içerikleri.`;

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
}

export default function TagPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  return <TagPageClient params={params} />;
}
