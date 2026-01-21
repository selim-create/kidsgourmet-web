import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/giris',
          '/kayit',
          '/sifre-sifirlama',
          '/profil/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://kidsgourmet.com.tr/sitemap.xml',
  };
}
