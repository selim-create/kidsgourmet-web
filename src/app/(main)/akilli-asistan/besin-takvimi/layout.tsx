import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Besin Deneme Takvimi | Kids Gourmet',
  description: 'Bebeğinizin denediği gıdaları takip edin. Haftalık besin takvimi ile sağlıklı ve düzenli bir beslenme programı oluşturun.',
  keywords: [
    'besin takvimi',
    'gıda takibi',
    'bebek beslenmesi',
    'yeni gıdalar',
    'reaksiyon takibi',
    'beslenme programı',
    'ek gıda takvimi',
  ],
  openGraph: {
    title: 'Besin Deneme Takvimi | Kids Gourmet',
    description: 'Bebeğinizin denediği gıdaları takip edin.',
    type: 'website',
  },
};

export default function BesinTakvimiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
