import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KidsGourmet - Bebek ve Çocuk Beslenme Rehberi | Uzman Onaylı Tarifler',
  description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman onaylı tarifler, beslenme rehberleri ve akıllı araçlarla sağlıklı gelişim. 6 ay+ bebekler için özel tarifler, BLW rehberi ve daha fazlası.',
  keywords: [
    'bebek beslenmesi',
    'çocuk tarifleri',
    'ek gıda',
    'BLW',
    'bebek led weaning',
    'uzman onaylı tarifler',
    'çocuk yemekleri',
    'sağlıklı bebek tarifleri',
    'bebek püresi',
    'çocuk gelişimi',
    'beslenme rehberi',
    'alerjen deneme',
    '6 aylık bebek tarifleri',
    'şekersiz bebek tarifleri',
  ].join(', '),
  authors: [{ name: 'KidsGourmet' }],
  creator: 'KidsGourmet',
  publisher: 'KidsGourmet',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kidsgourmet.com.tr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'KidsGourmet - Bebek ve Çocuk Beslenme Rehberi',
    description: 'Uzman onaylı bebek ve çocuk tarifleri, beslenme rehberleri ve akıllı araçlarla sağlıklı gelişim. 6 ay+ bebekler için özel içerikler.',
    url: 'https://kidsgourmet.com.tr',
    siteName: 'KidsGourmet',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KidsGourmet - Bebek ve Çocuk Beslenme Rehberi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KidsGourmet - Bebek ve Çocuk Beslenme Rehberi',
    description: 'Uzman onaylı bebek ve çocuk tarifleri, beslenme rehberleri ve akıllı araçlar.',
    images: ['/og-image.jpg'],
    creator: '@kidsgourmet',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
