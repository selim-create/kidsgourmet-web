import { Metadata } from 'next';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Keşfet - Ebeveyn Rehberleri ve Blog Yazıları | KidsGourmet',
  description: 'Uzman diyetisyen ve doktorlardan bebek beslenmesi, ek gıda, çocuk sağlığı hakkında güncel bilgiler ve rehberler. Sağlıklı beslenme ipuçları.',
  keywords: [
    'bebek beslenmesi',
    'ek gıda rehberi', 
    'çocuk sağlığı',
    'anne blog',
    'bebek bakımı',
    'diyetisyen önerileri',
    'BLW',
    'bebek yemekleri'
  ],
  openGraph: {
    title: 'Keşfet - Ebeveyn Rehberleri | KidsGourmet',
    description: 'Uzman onaylı bebek beslenmesi ve çocuk sağlığı rehberleri',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://kidsgourmet.com.tr/kesfet',
    siteName: 'KidsGourmet',
    images: [
      {
        url: 'https://kidsgourmet.com.tr/og-kesfet.jpg',
        width: 1200,
        height: 630,
        alt: 'KidsGourmet Keşfet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keşfet - Ebeveyn Rehberleri | KidsGourmet',
    description: 'Uzman onaylı bebek beslenmesi ve çocuk sağlığı rehberleri',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/kesfet',
  },
};

export default function KesfetPage() {
  return <BlogListClient />;
}