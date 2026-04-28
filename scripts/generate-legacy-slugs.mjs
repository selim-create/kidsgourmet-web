#!/usr/bin/env node
/**
 * WordPress blog slug listesi üretici
 *
 * Bu script, WordPress API'den tüm blog yazısı slug'larını çekerek
 * src/lib/legacy-blog-slugs.ts dosyasını günceller.
 *
 * Kullanım:
 *   node scripts/generate-legacy-slugs.mjs
 *
 * Gereksinimler:
 *   - Node.js 18+ (fetch dahili olarak gelir)
 *   - WP API erişimi (üretim ortamı veya VPN)
 *
 * API Endpoint:
 *   GET https://api.kidsgourmet.com.tr/wp-json/wp/v2/posts?per_page=100&_fields=slug&page=N
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = join(__dirname, '../src/lib/legacy-blog-slugs.ts');

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.kidsgourmet.com.tr/wp-json';
const PER_PAGE = 100;

async function fetchSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  console.log('WordPress blog yazısı slug\'ları çekiliyor...');

  while (page <= totalPages) {
    const url = `${WP_API_BASE}/wp/v2/posts?per_page=${PER_PAGE}&_fields=slug&page=${page}`;
    console.log(`  Sayfa ${page}/${totalPages}: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status} ${response.statusText} (${url})`);
    }

    const posts = await response.json();
    if (!Array.isArray(posts) || posts.length === 0) break;

    slugs.push(...posts.map((p) => p.slug).filter(Boolean));

    const wpTotalPages = response.headers.get('x-wp-totalpages');
    if (wpTotalPages) {
      totalPages = parseInt(wpTotalPages, 10);
    }

    page++;
  }

  return slugs;
}

function generateFileContent(slugs) {
  const now = new Date().toISOString();
  const slugLines = slugs.map((slug) => `  '${slug}',`).join('\n');

  return `/**
 * WordPress'ten taşınan blog yazılarının slug listesi.
 *
 * Bu dosya otomatik olarak üretilmiştir.
 * Son güncelleme: ${now}
 * Toplam slug sayısı: ${slugs.length}
 *
 * Yenilemek için: node scripts/generate-legacy-slugs.mjs
 *
 * Bu liste, middleware'in eski WordPress URL'lerini doğru şekilde yönlendirebilmesi
 * için gereklidir. Listede olmayan slug'lar artık /kesfet/'e yönlendirilmez; bunun
 * yerine Next.js'in doğal 404 sayfası gösterilir (Google için Soft 404 yerine gerçek 404).
 */
export const LEGACY_BLOG_SLUGS: string[] = [
${slugLines}
];
`;
}

async function main() {
  try {
    const slugs = await fetchSlugs();
    console.log(`\nToplam ${slugs.length} slug bulundu.`);

    const content = generateFileContent(slugs);
    writeFileSync(OUTPUT_FILE, content, 'utf-8');

    console.log(`\n✅ ${OUTPUT_FILE} dosyası güncellendi.`);
    console.log('Lütfen middleware\'in doğru çalıştığından emin olmak için uygulamayı yeniden başlatın.');
  } catch (error) {
    console.error('Hata:', error.message);
    process.exit(1);
  }
}

main();
