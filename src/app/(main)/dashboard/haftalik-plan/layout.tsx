import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haftalık Beslenme Planı | KidsGourmet',
  description: 'Bebeğiniz için kişiselleştirilmiş haftalık beslenme planı oluşturun. AI destekli öneri sistemi, alerjen kontrolü ve beslenme takibi.',
  keywords: [
    'bebek beslenme planı',
    'haftalık menü',
    'çocuk beslenmesi',
    'bebek yemekleri',
    'alerjen güvenli',
    'beslenme takvimi',
    'haftalık yemek planı',
    'bebek menü planlama',
    'yapay zeka beslenme'
  ],
  openGraph: {
    title: 'Haftalık Beslenme Planı | KidsGourmet',
    description: 'Bebeğiniz için kişiselleştirilmiş haftalık beslenme planı oluşturun.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'KidsGourmet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Haftalık Beslenme Planı | KidsGourmet',
    description: 'AI destekli haftalık beslenme planı oluşturun.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/dashboard/haftalik-plan',
  },
};

export default function HaftalikPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
