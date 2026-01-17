import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.kidsgourmet.com.tr',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'kidsgourmet.com.tr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kidsgourmet.com.tr',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/araclar',
        destination: '/akilli-asistan',
        permanent: true,
      },
      {
        source: '/araclar/:path*',
        destination: '/akilli-asistan/:path*',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/kesfet',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/kesfet/:path*',
        permanent: true,
      },
      {
        source: '/malzeme-rehberi',
        destination: '/beslenme-rehberi',
        permanent: true,
      },
      {
        source: '/malzeme-rehberi/:path*',
        destination: '/beslenme-rehberi/:path*',
        permanent: true,
      },
      // Eski kategori linkleri
      {
        source: '/kategori/:slug',
        destination: '/kesfet/kategori/:slug',
        permanent: true,
      },
      // Sayfa numaralı eski kategori linkleri
      {
        source: '/kategori/:slug/page/:page',
        destination: '/kesfet/kategori/:slug?page=:page',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
