import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alerjen Deneme Planlayıcı | Kids Gourmet',
  description: 'Bebeğinize alerjenik gıdaları güvenle tanıtın. Uzman onaylı deneme planları, dikkat edilmesi gerekenler ve acil durum bilgileri.',
  keywords: [
    'alerjen deneme',
    'bebek alerji',
    'gıda alerjisi',
    'süt alerjisi',
    'yumurta alerjisi',
    'fıstık alerjisi',
    'gluten',
    'alerji testi',
  ],
  openGraph: {
    title: 'Alerjen Deneme Planlayıcı | Kids Gourmet',
    description: 'Bebeğinize alerjenik gıdaları güvenle tanıtın.',
    type: 'website',
  },
};

export default function AlerjenPlanlayiciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
