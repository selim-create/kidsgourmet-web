import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_RECIPE_SLUGS } from '@/lib/legacy-recipes';
import { LEGACY_BLOG_SLUGS } from '@/lib/legacy-blog-slugs';

// Use Sets for O(1) lookups instead of Array.includes (O(n))
const LEGACY_RECIPE_SLUGS_SET = new Set(LEGACY_RECIPE_SLUGS);
const LEGACY_BLOG_SLUGS_SET = new Set(LEGACY_BLOG_SLUGS);

// Bilinen Next.js route'ları (redirect edilmemeli)
const KNOWN_ROUTES = new Set([
  'tarifler',
  'kesfet',
  'beslenme-rehberi',
  'akilli-asistan',
  'topluluk',
  'uzmanlar',
  'uzman',
  'profil',
  'dashboard',
  'favoriler',
  'alisveris-listesi',
  'arama',
  'etiket',
  'login',
  'register',
  'forgot-password',
  'reset-password',
  'hakkimizda',
  'kunye',
  'iletisim',
  'kullanim-kosullari',
  'gizlilik-politikasi',
  'cerez-politikasi',
  'acik-riza-metni',
  'basvuru-formu',
  'kvkk',
  'aydinlatma-metni',
  'reklam-verin',
  'yardim',
  'api',
  '_next',
  'favicon.ico',
  '1-yas-ustu-yemek',
  '06-12-ay-yemek',
  'kategoriler',
  'sitemap.xml',
  'robots.txt',
]);

// Bilinen statik dosya uzantıları
const STATIC_FILE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
  '.css', '.js', '.json', '.xml', '.txt', '.pdf',
  '.woff', '.woff2', '.ttf', '.eot',
]);

// WordPress'e özgü URL prefix'leri → 410 Gone
const WP_GONE_PREFIXES = [
  '/wp-admin',
  '/wp-login.php',
  '/wp-json',
  '/wp-content',
  '/wp-includes',
  '/feed',
  '/comments/feed',
];

// Tarih tabanlı permalink pattern: /YYYY/MM/slug
const DATE_BASED_PATTERN = /^\/(\d{4})\/(\d{2})\/([^/]+)\/?$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Statik dosyaları atla
  const lastDot = pathname.lastIndexOf('.');
  if (lastDot !== -1) {
    const ext = pathname.slice(lastDot).toLowerCase();
    if (STATIC_FILE_EXTENSIONS.has(ext)) {
      return NextResponse.next();
    }
  }

  // _next, api gibi sistem yollarını atla
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Root path'i atla
  if (pathname === '/') {
    return NextResponse.next();
  }

  // ── WordPress'e özgü URL'ler: 410 Gone ──────────────────────────────────
  for (const prefix of WP_GONE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return new NextResponse(null, { status: 410 });
    }
  }

  // /<slug>/feed ve /<slug>/feed/ gibi trailing feed URL'leri de 410
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    return new NextResponse(null, { status: 410 });
  }

  // ── Tarih tabanlı permalink: /YYYY/MM/slug → whitelist kontrolü ─────────
  const dateMatch = DATE_BASED_PATTERN.exec(pathname);
  if (dateMatch) {
    const slug = dateMatch[3];
    if (LEGACY_BLOG_SLUGS_SET.has(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/kesfet/${slug}`;
      return NextResponse.redirect(url, 301);
    }
    // Listede yoksa → gerçek 404
    return NextResponse.next();
  }

  // ── Pathname'i parçala ───────────────────────────────────────────────────
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return NextResponse.next();
  }

  const firstSegment = segments[0];

  // Bilinen route'ları atla
  if (KNOWN_ROUTES.has(firstSegment)) {
    return NextResponse.next();
  }

  // ── Tek segment: eski slug yönlendirmesi ────────────────────────────────
  if (segments.length === 1) {
    const slug = firstSegment;

    if (LEGACY_RECIPE_SLUGS_SET.has(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/tarifler/${slug}`;
      return NextResponse.redirect(url, 301);
    }

    if (LEGACY_BLOG_SLUGS_SET.has(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/kesfet/${slug}`;
      return NextResponse.redirect(url, 301);
    }

    // Listede değil → Next.js'in doğal 404'ünü ver (Soft 404 yerine gerçek 404)
    return NextResponse.next();
  }

  // ── Çok segmentli URL'ler ────────────────────────────────────────────────
  if (segments.length >= 2) {
    const lastSegment = segments[segments.length - 1];

    // Whitelist'te olan legacy blog slug'ını son segment olarak yakala
    if (LEGACY_BLOG_SLUGS_SET.has(lastSegment)) {
      const url = request.nextUrl.clone();
      url.pathname = `/kesfet/${lastSegment}`;
      return NextResponse.redirect(url, 301);
    }

    // Whitelist'te olmayan nested URL → gerçek 404
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
