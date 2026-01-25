import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_RECIPE_SLUGS } from '@/lib/legacy-recipes'; // 1. Adımda oluşturduğumuz listeyi import edin

// Bilinen Next.js route'ları (redirect edilmemeli)
const KNOWN_ROUTES = [
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
];

// Bilinen statik dosya uzantıları
const STATIC_FILE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
  '.css', '.js', '.json', '.xml', '.txt', '.pdf',
  '.woff', '.woff2', '.ttf', '.eot',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Statik dosyaları atla
  if (STATIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return NextResponse.next();
  }
  
  // _next, api gibi sistem yollarını atla
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Root path'i atla
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Pathname'i parçala
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return NextResponse.next();
  }
  
  const firstSegment = segments[0];
  
  // Bilinen route'ları atla
  if (KNOWN_ROUTES.includes(firstSegment)) {
    return NextResponse.next();
  }
  
  // Nested kategori yapısını kontrol et
  if (segments.length >= 2) {
    const lastSegment = segments[segments.length - 1];
    const url = request.nextUrl.clone();
    url.pathname = `/kesfet/kategori/${lastSegment}`;
    return NextResponse.redirect(url, 301);
  }
  
  // Tek segment var. Burası KRİTİK NOKTA.
  const slug = firstSegment;

  // ÖNCE TARİF KONTROLÜ YAPALIM
  // Eğer gelen slug bizim eski tarif listemizde varsa, onu /tarifler/ altına yönlendir.
  if (LEGACY_RECIPE_SLUGS.includes(slug)) {
    const url = request.nextUrl.clone();
    url.pathname = `/tarifler/${slug}`;
    return NextResponse.redirect(url, 301);
  }
  
  // Tarif değilse, varsayılan olarak blog yazısıdır -> /kesfet/
  const url = request.nextUrl.clone();
  url.pathname = `/kesfet/${slug}`;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};