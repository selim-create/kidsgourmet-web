import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ek Gıdaya Başlama Kontrolü | Kids Gourmet',
  description: 'Bebeğinizin ek gıdaya başlamaya hazır olup olmadığını öğrenin. WHO standartlarına uygun, bilimsel hazırlık değerlendirmesi.',
  keywords: [
    'ek gıdaya başlama',
    'bebek beslenme hazırlığı',
    'ek gıda yaşı',
    '6 aylık bebek',
    'ek gıda test',
    'WHO standartları',
    'bebek gelişimi',
  ],
  openGraph: {
    title: 'Ek Gıdaya Başlama Kontrolü | Kids Gourmet',
    description: 'Bebeğinizin ek gıdaya başlamaya hazır olup olmadığını öğrenin.',
    type: 'website',
  },
};

export default function EkGidayaBaslamaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
