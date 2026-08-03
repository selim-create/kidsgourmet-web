import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppDownloadFooter from "@/components/app/AppDownloadFooter";
import MobileAppBanner from "@/components/app/MobileAppBanner";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { HeaderLeaderboardAd, HeaderMobileAd, FooterStickyMobileAd, PageSkinAds, InterstitialAd } from "@/components/ads";
import { AdProvider } from "@/contexts/AdContext";
import { APP_DOWNLOAD_URL } from "@/lib/app-links";
import { SITE_URL } from "@/lib/constants";
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
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'KidsGourmet - Bebek ve Çocuk Beslenme Rehberi',
    description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman görüşleri, sağlıklı tarifler ve akıllı araçlarla yanınızdayız.',
    url: SITE_URL,
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
  other: {
    'apple-itunes-app': `app-id=6784156670, app-argument=${APP_DOWNLOAD_URL}`,
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

        {/* Header Ads - Desktop leaderboard, Mobile banner */}
        <div className="w-full mt-[72px] lg:mt-[80px]">
          <HeaderLeaderboardAd />
          <HeaderMobileAd />
        </div>

        <main className="flex-grow w-full">
          {children}
        </main>

        {/* App Store and Google Play links in the footer area */}
        <AppDownloadFooter />
        <Footer />

        {/* Mobile visitors get the correct store link for their platform */}
        <MobileAppBanner />

        {/* Mobile Sticky Footer Ad */}
        <FooterStickyMobileAd />

        {/* Page Skin Ads - Left and right for very wide screens */}
        <PageSkinAds />

        {/* Interstitial Ad - Out-of-page overlay, no DOM container needed */}
        <InterstitialAd />
      </div>
    </AdProvider>
  );
}
