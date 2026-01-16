import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Günlük Hijyen Hesaplayıcı | Bebek Mendil İhtiyacı - KidsGourmet',
  description: 'Bebeğinizin yaşına, bez değişim sıklığına ve aktivitesine göre günlük, haftalık ve aylık ıslak mendil ihtiyacını hesaplayın. Çanta hazırlığı önerileri ile birlikte.',
  keywords: ['bebek mendil', 'ıslak mendil hesaplama', 'bebek hijyen', 'günlük mendil ihtiyacı', 'bebek bakım', 'bez değişimi'],
  openGraph: {
    title: 'Günlük Hijyen Hesaplayıcı | KidsGourmet',
    description: 'Bebeğinizin günlük ıslak mendil ihtiyacını hesaplayın ve çanta hazırlığı önerilerini alın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'KidsGourmet',
    images: [
      {
        url: '/images/tools/hijyen-hesaplayici-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Günlük Hijyen Hesaplayıcı',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Günlük Hijyen Hesaplayıcı | KidsGourmet',
    description: 'Bebeğinizin günlük ıslak mendil ihtiyacını hesaplayın.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://kidsgourmet.com/akilli-asistan/hijyen-hesaplayici',
  },
};

export default function HygieneCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
