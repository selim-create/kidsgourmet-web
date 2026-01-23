import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { UserProvider } from "@/hooks/use-user";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { ChildProfileProvider } from "@/contexts/ChildProfileContext";
import { ActiveChildProvider } from "@/contexts/ActiveChildContext";
import { RateLimitProvider } from "@/contexts/rate-limit-context";
import { AdProvider } from "@/contexts/AdContext";
import { SWRProvider } from "@/providers/swr-provider";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/common/CookieConsent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kidsgourmet.com.tr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KidsGourmet - Mutlu Bebekler, Bilinçli Ebeveynler",
    template: "%s | KidsGourmet",
  },
  description: "Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman onaylı tarifler, beslenme rehberleri ve akıllı araçlar.",
  keywords: [
    'bebek beslenmesi',
    'çocuk tarifleri',
    'ek gıda',
    'BLW',
    'bebek led weaning',
    'uzman onaylı tarifler',
    'çocuk yemekleri',
    'sağlıklı bebek tarifleri',
  ],
  authors: [{ name: 'KidsGourmet' }],
  creator: 'KidsGourmet',
  publisher: 'KidsGourmet',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName: 'KidsGourmet',
    title: 'KidsGourmet - Mutlu Bebekler, Bilinçli Ebeveynler',
    description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman onaylı tarifler, beslenme rehberleri ve akıllı araçlar.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KidsGourmet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KidsGourmet - Mutlu Bebekler, Bilinçli Ebeveynler',
    description: 'Bebek ve çocuk beslenmesinde güvenilir rehberiniz.',
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
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-NRE6H8PMK4';

  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body className="bg-gray-50 text-brand-dark font-sans antialiased">
        {/* Google Consent Mode v2 - MUST load before gtag */}
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent state - deny all until user consents
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'wait_for_update': 500
            });
            
            // Check for existing consent
            try {
              const savedConsent = localStorage.getItem('cookie_consent');
              if (savedConsent) {
                const prefs = JSON.parse(savedConsent);
                gtag('consent', 'update', {
                  'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                  'ad_storage': prefs.marketing ? 'granted' : 'denied',
                  'ad_user_data': prefs.marketing ? 'granted' : 'denied',
                  'ad_personalization': prefs.marketing ? 'granted' : 'denied',
                  'functionality_storage': prefs.functional ? 'granted' : 'denied',
                  'personalization_storage': prefs.functional ? 'granted' : 'denied',
                });
              }
            } catch (e) {}
          `}
        </Script>

        {/* Google Analytics 4 - loads with consent mode */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>

        <SWRProvider>
          <UserProvider>
            <FavoritesProvider>
              <ActiveChildProvider>
                <ChildProfileProvider>
                  <RateLimitProvider>
                    <AdProvider>
                      {children}
                      <CookieConsent />
                      <Toaster position="top-right" richColors toastOptions={{ style: { marginTop: '120px' } }} />
                    </AdProvider>
                  </RateLimitProvider>
                </ChildProfileProvider>
              </ActiveChildProvider>
            </FavoritesProvider>
          </UserProvider>
        </SWRProvider>
      </body>
    </html>
  );
}