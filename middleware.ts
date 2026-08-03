import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_RECIPE_SLUGS } from '@/lib/legacy-recipes';
import { LEGACY_BLOG_SLUGS } from '@/lib/legacy-blog-slugs';

const LEGACY_RECIPE_SLUGS_SET = new Set(LEGACY_RECIPE_SLUGS);
const LEGACY_BLOG_SLUGS_SET = new Set(LEGACY_BLOG_SLUGS);

const LEGACY_ID_MAP: Readonly<Record<string, string>> = {
  '36942': '/kesfet/sezaryen-dogum-yapan-10-unlu-anne',
  '54278': '/kesfet/evolviadan-gelisimi-destekleyen-yenilikci-formuller',
};

const LEGACY_PATH_MAP: Readonly<Record<string, string>> = {
  'sezaryen-dogum-yapan-10-unlu-anne': '/kesfet/sezaryen-dogum-yapan-10-unlu-anne',
  'evolviadan-gelisimi-destekleyen-yenilikci-formuller': '/kesfet/evolviadan-gelisimi-destekleyen-yenilikci-formuller',
};

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

const STATIC_FILE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
  '.css', '.js', '.json', '.xml', '.txt', '.pdf',
  '.woff', '.woff2', '.ttf', '.eot',
]);

const WP_GONE_PREFIXES = [
  '/wp-admin',
  '/wp-login.php',
  '/wp-json',
  '/wp-content',
  '/wp-includes',
  '/feed',
  '/comments/feed',
];

const DATE_BASED_PATTERN = /^\/(\d{4})\/(\d{2})\/([^/]+)\/?$/;

function permanentRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const legacyId = searchParams.get('p') || searchParams.get('page_id');
  if (pathname === '/' && legacyId && LEGACY_ID_MAP[legacyId]) {
    return permanentRedirect(request, LEGACY_ID_MAP[legacyId]);
  }

  const lastDot = pathname.lastIndexOf('.');
  if (lastDot !== -1) {
    const ext = pathname.slice(lastDot).toLowerCase();
    if (STATIC_FILE_EXTENSIONS.has(ext)) return NextResponse.next();
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (pathname === '/') return NextResponse.next();

  for (const prefix of WP_GONE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return new NextResponse(null, { status: 410 });
    }
  }

  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    return new NextResponse(null, { status: 410 });
  }

  const dateMatch = DATE_BASED_PATTERN.exec(pathname);
  if (dateMatch) {
    const slug = dateMatch[3];
    if (LEGACY_PATH_MAP[slug]) {
      return permanentRedirect(request, LEGACY_PATH_MAP[slug]);
    }
    if (LEGACY_RECIPE_SLUGS_SET.has(slug)) {
      return permanentRedirect(request, `/tarifler/${slug}`);
    }
    if (LEGACY_BLOG_SLUGS_SET.has(slug)) {
      return permanentRedirect(request, `/kesfet/${slug}`);
    }
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return NextResponse.next();

  if (KNOWN_ROUTES.has(segments[0])) return NextResponse.next();

  if (segments.length === 1) {
    const slug = segments[0];
    if (LEGACY_PATH_MAP[slug]) {
      return permanentRedirect(request, LEGACY_PATH_MAP[slug]);
    }
    if (LEGACY_RECIPE_SLUGS_SET.has(slug)) {
      return permanentRedirect(request, `/tarifler/${slug}`);
    }
    if (LEGACY_BLOG_SLUGS_SET.has(slug)) {
      return permanentRedirect(request, `/kesfet/${slug}`);
    }
    return NextResponse.next();
  }

  const lastSegment = segments[segments.length - 1];
  if (LEGACY_PATH_MAP[lastSegment]) {
    return permanentRedirect(request, LEGACY_PATH_MAP[lastSegment]);
  }
  if (LEGACY_RECIPE_SLUGS_SET.has(lastSegment)) {
    return permanentRedirect(request, `/tarifler/${lastSegment}`);
  }
  if (LEGACY_BLOG_SLUGS_SET.has(lastSegment)) {
    return permanentRedirect(request, `/kesfet/${lastSegment}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
