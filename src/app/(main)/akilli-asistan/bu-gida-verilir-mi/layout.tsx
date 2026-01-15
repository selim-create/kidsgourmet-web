import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bu Gıda Verilir mi? | Kids Gourmet',
  description: 'Bebeğinize hangi gıdaları verebileceğinizi öğrenin. Yaşa uygun gıda önerileri, hazırlama yöntemleri ve dikkat edilmesi gerekenler.',
  keywords: [
    'bebek gıdaları',
    'yaşa göre gıda',
    'ek gıda rehberi',
    'bebek beslenmesi',
    'gıda güvenliği',
    'parmak yiyecek',
    'püre tarifleri',
  ],
  openGraph: {
    title: 'Bu Gıda Verilir mi? | Kids Gourmet',
    description: 'Bebeğinize hangi gıdaları verebileceğinizi öğrenin.',
    type: 'website',
  },
};

export default function BuGidaVerilirMiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
