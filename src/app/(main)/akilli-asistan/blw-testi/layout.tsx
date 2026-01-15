import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BLW Hazırlık Testi - Bebeğiniz Hazır mı? | KidsGourmet',
  description: 'WHO standartlarında 8 soruluk test ile bebeğinizin Baby-Led Weaning (BLW) yöntemine hazır olup olmadığını öğrenin. Ücretsiz, hızlı ve güvenilir.',
  keywords: ['BLW', 'Baby Led Weaning', 'bebek beslenmesi', 'ek gıda', 'hazırlık testi', 'WHO', 'bebek gelişimi'],
};

export default function BLWTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
