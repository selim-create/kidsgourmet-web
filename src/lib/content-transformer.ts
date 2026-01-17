/**
 * WordPress API'den gelen HTML içeriğindeki linkleri dönüştürür
 */

const API_DOMAIN = 'api.kidsgourmet.com.tr';
const OLD_DOMAIN = 'kidsgourmet.com.tr';
const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://kidsgourmet.com.tr';
const API_URL = `https://${API_DOMAIN}`;

/**
 * HTML içeriğindeki tüm linkleri dönüştürür
 */
export function transformContentLinks(html: string): string {
  if (!html) return html;
  
  let transformed = html;
  
  // 1. ÖNCE: Hatalı "/kesfet/wp-content/uploads/" URL'lerini düzelt
  // Bu URL'ler yanlışlıkla oluşmuş, görselleri API'ye yönlendir
  transformed = transformed.replace(
    /https?:\/\/(?:www\.)?kidsgourmet\.com\.tr\/kesfet\/wp-content\/uploads\//g,
    `${API_URL}/wp-content/uploads/`
  );
  
  // 2. api.kidsgourmet.com.tr/wp-content/uploads/ → DEĞİŞTİRME (görseller API'de kalmalı)
  // Sadece link olan (href içindeki) API URL'lerini dönüştür, img src'leri hariç
  // Regex: href içinde olan ve /wp-content/ ile BAŞLAMAYAN API linkleri
  transformed = transformed.replace(
    /href="https?:\/\/api\.kidsgourmet\.com\.tr\/(?!wp-content\/)([^"]*)"/g,
    `href="${FRONTEND_DOMAIN}/kesfet/$1"`
  );
  
  // 3. Eski kidsgourmet.com.tr linklerini dönüştür (görseller hariç)
  transformed = transformed.replace(
    /href="https?:\/\/(?:www\.)?kidsgourmet\.com\.tr\/(?!wp-content\/)([^"]*)"/g,
    `href="${FRONTEND_DOMAIN}/$1"`
  );
  
  // 4. Trailing slash'ları kaldır (SEO için tutarlılık)
  transformed = transformed.replace(
    /href="([^"]+)\/"/g,
    'href="$1"'
  );
  
  // 5. Göreceli linkleri düzelt (görseller hariç)
  transformed = transformed.replace(
    /href="\/(?!tarifler|kesfet|beslenme-rehberi|akilli-asistan|topluluk|uzmanlar|etiket|kategori|api|_next|favicon|wp-content)([^"\/][^"]*)"/g,
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
    
    // wp-content path'leri her zaman API'den gelir
    if (urlObj.pathname.startsWith('/wp-content/')) {
      return `${API_URL}${urlObj.pathname}`;
    }
    
    // API domain'inden gelen linkler (görseller hariç - yukarıda yakalandı)
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
    // wp-content göreceli path'leri
    if (url.startsWith('/wp-content/')) {
      return `${API_URL}${url}`;
    }
    
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
