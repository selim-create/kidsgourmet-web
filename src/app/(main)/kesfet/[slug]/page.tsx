import { Metadata } from 'next';
import BlogDetailPage from './BlogDetailClient';
import { blogService } from '@/services/blog-service';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await blogService.getBySlug(slug);
    if (!post) return {};

    const title = post.seo?.title || `${post.title.rendered.replace(/<[^>]*>/g, '')} | KidsGourmet`;
    const description = post.seo?.description || post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160);
    const ogImage = post.seo?.og_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const url = `${SITE_URL}/kesfet/${slug}`;

    return {
      title,
      description,
      keywords: post.seo?.focus_keywords,
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

export default function BlogDetailPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogDetailPage params={params} />;
}
