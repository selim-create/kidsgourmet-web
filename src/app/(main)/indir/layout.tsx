import type { Metadata } from 'next';
import { APP_DOWNLOAD_URL } from '@/lib/app-links';

export const metadata: Metadata = {
  title: 'KidsGourmet Uygulamasını İndir | iOS ve Android',
  description: 'KidsGourmet ebeveyn rehberini App Store veya Google Play üzerinden ücretsiz indirin.',
  alternates: {
    canonical: APP_DOWNLOAD_URL,
  },
  openGraph: {
    title: 'KidsGourmet Uygulamasını İndir',
    description: 'Tarifler, ebeveyn rehberleri ve akıllı araçlar iOS ve Android uygulamasında.',
    url: APP_DOWNLOAD_URL,
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KidsGourmet mobil uygulaması',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KidsGourmet Uygulamasını İndir',
    description: 'iOS ve Android için KidsGourmet ebeveyn rehberi.',
    images: ['/og-image.jpg'],
  },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
