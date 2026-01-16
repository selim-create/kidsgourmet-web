/**
 * WordPress API'den gelen HTML içeriğindeki linkleri dönüştürür
 */

const API_DOMAIN = 'api.kidsgourmet.com.tr';
const OLD_DOMAIN = 'kidsgourmet.com.tr';
const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://kidsgourmet.com';

// Bilinen içerik türleri ve prefix'leri
const CONTENT_TYPE_PREFIXES: Record<string, string> = {
  recipe: '/tarifler',
  post: '/kesfet',
  ingredient: '/beslenme-rehberi',
  discussion: '/topluluk/soru',
};

interface TransformOptions {
  contentType?: 'recipe' | 'post' | 'ingredient' | 'discussion';
}

/**
 * HTML içeriğindeki tüm linkleri dönüştürür
 */
export function transformContentLinks(html: string, options?: TransformOptions): string {
  if (!html) return html;
  
  let transformed = html;
  
  // 1. api.kidsgourmet.com.tr linklerini dönüştür
  transformed = transformed.replace(
    /https?:\/\/api\.kidsgourmet\.com\.tr\/?/g,
    `${FRONTEND_DOMAIN}/kesfet/`
  );
  
  // 2. Eski kidsgourmet.com.tr linklerini dönüştür (http ve https)
  transformed = transformed.replace(
    /https?:\/\/(?:www\.)?kidsgourmet\.com\.tr\/?/g,
    `${FRONTEND_DOMAIN}/`
  );
  
  // 3. Trailing slash'ları kaldır (SEO için tutarlılık)
  transformed = transformed.replace(
    /href="([^"]+)\/"/g,
    'href="$1"'
  );
  
  // 4. Göreceli linkleri düzelt
  // Örn: href="/bebeklerde-reflu/" -> href="/kesfet/bebeklerde-reflu"
  transformed = transformed.replace(
    /href="\/(?!tarifler|kesfet|beslenme-rehberi|akilli-asistan|topluluk|uzmanlar|etiket|kategori|api|_next|favicon)([^"\/][^"]*)"/g,
    (match, slug) => {
      // Trailing slash'ı kaldır
      const cleanSlug = slug.replace(/\/$/, '');
      return `href="/kesfet/${cleanSlug}"`;
    }
  );
  
  return transformed;
}

/**
 * Tek bir URL'i dönüştürür
 */
export function transformUrl(url: string): string {
  if (!url) return url;
  
  // Tam URL mi kontrol et
  try {
    const urlObj = new URL(url, FRONTEND_DOMAIN);
    
    // API domain'inden gelen linkler
    if (urlObj.hostname === API_DOMAIN || urlObj.hostname === `www.${API_DOMAIN}`) {
      const pathname = urlObj.pathname.replace(/\/$/, ''); // trailing slash kaldır
      return `/kesfet${pathname}`;
    }
    
    // Eski domain'den gelen linkler
    if (urlObj.hostname === OLD_DOMAIN || urlObj.hostname === `www.${OLD_DOMAIN}`) {
      const pathname = urlObj.pathname.replace(/\/$/, '');
      
      // Bilinen route'ları kontrol et
      const firstSegment = pathname.split('/').filter(Boolean)[0];
      const knownPrefixes = ['tarifler', 'kesfet', 'beslenme-rehberi', 'akilli-asistan', 'topluluk', 'uzmanlar', 'etiket'];
      
      if (knownPrefixes.includes(firstSegment)) {
        return pathname;
      }
      
      // Bilinmeyen path'leri kesfet altına al
      return `/kesfet${pathname}`;
    }
    
    // Diğer domain'ler - değiştirme
    if (urlObj.hostname && urlObj.hostname !== new URL(FRONTEND_DOMAIN).hostname) {
      return url;
    }
    
    // Göreceli URL
    return url;
  } catch {
    // URL parse edilemedi, göreceli path olabilir
    if (url.startsWith('/')) {
      const pathname = url.replace(/\/$/, '');
      const firstSegment = pathname.split('/').filter(Boolean)[0];
      const knownPrefixes = ['tarifler', 'kesfet', 'beslenme-rehberi', 'akilli-asistan', 'topluluk', 'uzmanlar', 'etiket', 'kategori'];
      
      if (knownPrefixes.includes(firstSegment)) {
        return pathname;
      }
      
      return `/kesfet${pathname}`;
    }
    
    return url;
  }
}

/**
 * Excerpt veya kısa metinlerdeki linkleri dönüştürür
 */
export function transformExcerptLinks(text: string): string {
  return transformContentLinks(text);
}

/**
 * WordPress'ten gelen ham veriyi temizler ve dönüştürür
 */
export function sanitizeAndTransformContent(content: string): string {
  if (!content) return content;
  
  // Link dönüşümü
  let result = transformContentLinks(content);
  
  // WordPress'in eklediği gereksiz boşlukları temizle
  result = result.replace(/\n\n+/g, '\n\n');
  
  return result;
}
