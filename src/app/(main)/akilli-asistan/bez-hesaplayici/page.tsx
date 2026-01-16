import type { Metadata } from 'next';
import DiaperCalculatorClient from './DiaperCalculatorClient';

export const metadata: Metadata = {
  title: 'Akıllı Bez Hesaplayıcı | Bez Numarası ve Aylık İhtiyaç Hesaplama | KidsGourmet',
  description: 'Bebeğinizin kilosuna göre doğru bez numarasını öğrenin. Günlük ve aylık bez ihtiyacınızı hesaplayın. Pişik riski analizi ile bebeğinizi koruyun. Uzman onaylı bebek bakım aracı.',
  keywords: ['bebek bezi', 'bez hesaplayıcı', 'bez numarası', 'pişik riski', 'bebek bakımı', 'aylık bez ihtiyacı', 'bez boyutu'],
  openGraph: {
    title: 'Akıllı Bez Hesaplayıcı | KidsGourmet',
    description: 'Bebeğinizin kilosuna göre doğru bez numarasını öğrenin. Günlük ve aylık bez ihtiyacınızı hesaplayın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'KidsGourmet',
    url: '/akilli-asistan/bez-hesaplayici',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akıllı Bez Hesaplayıcı | KidsGourmet',
    description: 'Bebeğinizin kilosuna göre doğru bez numarasını öğrenin.',
  },
  alternates: {
    canonical: '/akilli-asistan/bez-hesaplayici',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Akıllı Bez Hesaplayıcı',
  description: 'Bebeğinizin kilosuna göre doğru bez numarasını ve aylık bez ihtiyacınızı hesaplayın.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'TRY',
  },
  provider: {
    '@type': 'Organization',
    name: 'KidsGourmet',
    url: 'https://kidsgourmet.com.tr',
  },
};

export default function DiaperCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DiaperCalculatorClient />
    </>
  );
}
