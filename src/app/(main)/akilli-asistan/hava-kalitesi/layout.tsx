import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hava Kalitesi Rehberi - Bebek ve Çocuklar İçin | KidsGourmet',
  description: 'Evinizin iç mekan hava kalitesini değerlendirin, bebeğiniz için risk analizi yapın ve kişiselleştirilmiş öneriler alın. Pediatri uzmanları tarafından onaylanmış içerik.',
  keywords: ['hava kalitesi', 'bebek sağlığı', 'ev içi hava', 'çocuk solunum', 'iç mekan hava kalitesi', 'bebek odası hava kalitesi'],
  openGraph: {
    title: 'Hava Kalitesi Rehberi - Bebek ve Çocuklar İçin',
    description: 'Evinizin iç mekan hava kalitesini değerlendirin ve bebeğiniz için kişiselleştirilmiş öneriler alın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'KidsGourmet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hava Kalitesi Rehberi - Bebek ve Çocuklar İçin',
    description: 'Evinizin iç mekan hava kalitesini değerlendirin ve bebeğiniz için kişiselleştirilmiş öneriler alın.',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com/akilli-asistan/hava-kalitesi',
  },
};

export default function AirQualityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
