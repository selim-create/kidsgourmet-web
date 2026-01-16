import { Metadata } from 'next';
import StainEncyclopediaClient from '@/components/tools/StainEncyclopediaClient';

export const metadata: Metadata = {
  title: 'Leke Ansiklopedisi | Bebek Kıyafetlerindeki Lekeler İçin Çözüm Rehberi | KidsGourmet',
  description: 'Bebek kıyafetlerindeki inatçı lekeleri kolayca çıkarın! Domates, çikolata, çim, mama ve 50+ leke türü için adım adım temizlik rehberi.',
  keywords: ['leke çıkarma', 'bebek kıyafeti leke', 'mama lekesi', 'çikolata lekesi', 'domates lekesi', 'bebek giysi temizliği'],
  openGraph: {
    title: 'Leke Ansiklopedisi | KidsGourmet',
    description: 'Bebek kıyafetlerindeki inatçı lekeleri kolayca çıkarın! 50+ leke türü için adım adım temizlik rehberi.',
    type: 'website',
    url: 'https://kidsgourmet.com.tr/akilli-asistan/leke-rehberi',
    images: [
      {
        url: 'https://kidsgourmet.com.tr/og/leke-ansiklopedisi.jpg',
        width: 1200,
        height: 630,
        alt: 'Leke Ansiklopedisi - KidsGourmet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leke Ansiklopedisi | KidsGourmet',
    description: 'Bebek kıyafetlerindeki inatçı lekeleri kolayca çıkarın!',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/akilli-asistan/leke-rehberi',
  },
};

export default function StainEncyclopediaPage() {
  return <StainEncyclopediaClient />;
}
