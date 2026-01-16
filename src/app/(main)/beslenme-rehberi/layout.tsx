import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beslenme Rehberi | Bebek ve Çocuk Beslenmesi Malzeme Sözlüğü | KidsGourmet',
  description: 'Bebeğiniz neyi, ne zaman yiyebilir? 200+ malzeme ile uzman onaylı beslenme rehberi. Alerji riskleri, mevsimlik besinler, başlangıç yaşları ve hazırlama önerileri.',
  keywords: [
    'bebek beslenmesi',
    'ek gıda rehberi',
    'malzeme rehberi',
    'bebek yiyecekleri',
    'alerji riski',
    'mevsimlik besinler',
    'bebek beslenme sözlüğü',
    'çocuk beslenmesi',
    '6 aylık bebek gıdaları',
    'ek gıdaya başlama'
  ],
  openGraph: {
    title: 'Beslenme Rehberi - Bebek Beslenmesi Sözlüğü | KidsGourmet',
    description: 'Bebeğiniz için uygun besinleri keşfedin. Uzman onaylı malzeme rehberi ile güvenli besleme.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'KidsGourmet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beslenme Rehberi | KidsGourmet',
    description: 'Bebeğiniz neyi, ne zaman yiyebilir? Uzman onaylı beslenme rehberi.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/beslenme-rehberi',
  },
};

export default function BeslenmeRehberiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
