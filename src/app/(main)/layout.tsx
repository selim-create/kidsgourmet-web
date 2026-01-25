import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { AdZone } from "@/components/ads";
import { AdProvider } from "@/contexts/AdContext";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KidsGourmet - Bebek ve Çocuk Beslenme Rehberi | Bebek ve Çocuk Tarifleri',
  description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman görüşleri, sağlıklı tarifler ve akıllı araçlarla yanınızdayız.',
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
    description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman görüşleri, sağlıklı tarifler ve akıllı araçlarla yanınızdayız.',
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
    <AdProvider>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* Masthead Banner - Header altı, proper spacing */}
        <div className="w-full flex justify-center py-3 bg-gray-50/50 mt-[72px] lg:mt-[80px]">
          <div className="container mx-auto px-4">
            <AdZone placement="header" />
          </div>
        </div>
        
        <main className="flex-grow w-full">
          {children}
        </main>
        
        {/* Footer Banner - Footer üstü */}
        <div className="w-full flex justify-center py-4 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <AdZone placement="footer" />
          </div>
        </div>
        
        <Footer />
        
        {/* Mobile Sticky Bottom - Sadece mobilde, AdZone içinde handle ediliyor */}
        <AdZone placement="mobile-sticky" />
      </div>
    </AdProvider>
  );
}
