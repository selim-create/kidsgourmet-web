import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Su İhtiyacı Hesaplayıcı | Kids Gourmet',
  description: 'Bebeğinizin kilosuna ve yaşına göre günlük sıvı ihtiyacını hesaplayın. WHO önerilerine uygun su ihtiyacı hesaplaması.',
  keywords: ['bebek su ihtiyacı', 'günlük sıvı ihtiyacı', 'bebek beslenmesi', 'su hesaplama', 'WHO önerileri'],
  openGraph: {
    title: 'Su İhtiyacı Hesaplayıcı - Kids Gourmet',
    description: 'Bebeğinizin günlük sıvı ihtiyacını WHO önerilerine göre hesaplayın',
    type: 'website',
  },
};

export default function WaterCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
