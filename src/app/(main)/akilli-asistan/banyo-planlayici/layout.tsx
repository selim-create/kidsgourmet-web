import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banyo Rutini Planlayıcı | Bebek Banyo Rehberi | KidsGourmet',
  description: 'Bebeğinizin yaşına, cilt tipine ve mevsime göre kişiselleştirilmiş banyo rutini planı oluşturun. Pediatri uzmanları tarafından onaylanmış bebek banyo rehberi.',
  keywords: ['bebek banyosu', 'banyo rutini', 'bebek cilt bakımı', 'yenidoğan banyo', 'bebek hijyen'],
  openGraph: {
    title: 'Banyo Rutini Planlayıcı | KidsGourmet',
    description: 'Bebeğiniz için mevsime ve cilt tipine uygun banyo rutini oluşturun',
    type: 'website',
    locale: 'tr_TR',
    images: [
      {
        url: '/images/tools/bath-planner-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Bebek Banyo Rutini Planlayıcı',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banyo Rutini Planlayıcı | KidsGourmet',
    description: 'Bebeğiniz için kişiselleştirilmiş banyo rutini planı',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://kidsgourmet.com/akilli-asistan/banyo-planlayici',
  },
};

export default function BathPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
