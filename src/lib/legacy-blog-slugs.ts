/**
 * WordPress'ten taşınan blog yazılarının slug listesi.
 *
 * Bu liste, middleware'in eski WordPress URL'lerini doğru şekilde yönlendirebilmesi
 * için gereklidir. Listede olmayan slug'lar artık /kesfet/'e yönlendirilmez; bunun
 * yerine Next.js'in doğal 404 sayfası gösterilir (Google için Soft 404 yerine gerçek 404).
 *
 * ÖNEMLİ: Bu liste boş olduğunda eski WordPress blog URL'leri 301 redirect almaz ve
 * Next.js 404 döner. Bu durum "Soft 404" yerine gerçek 404 olduğu için Google açısından
 * DAHA İYİDİR. Ancak Google'ın halâ indekslediği eski URL'lerin yeni URL'lere yönlendirilmesi
 * için listeyi doldurun.
 *
 * Listeyi doldurmak için:
 *   node scripts/generate-legacy-slugs.mjs
 *
 * Script, WordPress API'den tüm blog yazısı slug'larını çekip bu dosyayı günceller:
 *   GET https://api.kidsgourmet.com.tr/wp-json/wp/v2/posts?per_page=100&_fields=slug&page=N
 *
 * TODO: Deployment öncesinde aşağıdaki komutu çalıştırın:
 *   node scripts/generate-legacy-slugs.mjs
 */
export const LEGACY_BLOG_SLUGS: string[] = [
  // Buraya WordPress'ten taşınan blog yazısı slug'larını ekleyin.
  // Örnek:
  // 'ek-gida-nedir',
  // 'blw-baslangic-rehberi',
];
