import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  'kvkk',
  'aydinlatma-metni',
  'reklam-verin',
  'yardim',
  'api',
  '_next',
  'favicon.ico',
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
  
  // Nested kategori yapısını kontrol et (örn: /cocuk/cocuk-sagligi/cocuk-beslenmesi/)
  // Bu durumda son segment'i al ve /kesfet/kategori/[son-segment]'e yönlendir
  if (segments.length >= 2) {
    // Muhtemelen nested kategori veya eski yapı
    const lastSegment = segments[segments.length - 1];
    
    // Kategori olup olmadığını kontrol etmek için API'ye sorgu yapılabilir
    // Şimdilik son segment'i kullanarak kesfet'e yönlendir
    const url = request.nextUrl.clone();
    url.pathname = `/kesfet/kategori/${lastSegment}`;
    return NextResponse.redirect(url, 301);
  }
  
  // Tek segment var - bu ya eski blog yazısı ya da eski kategori
  // Önce kesfet altında blog yazısı olarak dene
  const slug = firstSegment;
  
  // 301 redirect to /kesfet/[slug]
  const url = request.nextUrl.clone();
  url.pathname = `/kesfet/${slug}`;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
