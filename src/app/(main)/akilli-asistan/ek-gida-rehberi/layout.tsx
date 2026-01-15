import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ek Gıda Rehberi | Kids Gourmet',
  description: 'Bu besin bebeğime uygun mu? Malzemeleri arayın ve bebeğinizin yaşına göre uygunluğunu öğrenin. Alerji riskleri, hazırlama önerileri ve daha fazlası.',
  keywords: ['ek gıda rehberi', 'bebek beslenmesi', 'malzeme arama', 'alerji riski', 'bebek yiyecekleri', 'uygun besinler'],
  openGraph: {
    title: 'Ek Gıda Rehberi - Kids Gourmet',
    description: 'Bebeğiniz için uygun besinleri keşfedin, alerji risklerini öğrenin',
    type: 'website',
  },
};

export default function FoodGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
