/**
 * WordPress'ten taşınan blog yazılarının slug listesi.
 *
 * Bu liste, middleware'in eski WordPress URL'lerini doğru şekilde yönlendirebilmesi
 * için gereklidir. Listede olmayan slug'lar artık /kesfet/'e yönlendirilmez; bunun
 * yerine Next.js'in doğal 404 sayfası gösterilir (Google için Soft 404 yerine gerçek 404).
 *
 * Listeyi güncellemek için:
 *   node scripts/generate-legacy-slugs.mjs
 *
 * Script, WordPress API'den tüm blog yazısı slug'larını çekip bu dosyaya yazar.
 * API endpoint: https://api.kidsgourmet.com.tr/wp-json/wp/v2/posts?per_page=100&_fields=slug
 *
 * TODO: Bu listeyi WP API'den üretilen slug'larla doldurun.
 * Örnek komut: node scripts/generate-legacy-slugs.mjs
 */
export const LEGACY_BLOG_SLUGS: string[] = [
  // Buraya WordPress'ten taşınan blog yazısı slug'larını ekleyin.
  // Örnek:
  // 'ek-gida-nedir',
  // 'blw-baslangic-rehberi',
];
