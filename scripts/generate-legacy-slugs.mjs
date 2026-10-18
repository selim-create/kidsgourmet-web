#!/usr/bin/env node
/**
 * WordPress blog slug listesi üretici.
 * Bu komut yalnızca bilerek çalıştırıldığında takip edilen SEO snapshot'ını yeniler.
 * Production build kaynak dosyalarını değiştirmez.
 *
 * Kullanım:
 *   npm run refresh:legacy-slugs
 *
 * Gereksinimler:
 *   - Node.js 18+ (fetch dahili olarak gelir)
 *   - WP API erişimi (üretim ortamı veya VPN)
 *
 * API Endpoint:
 *   GET https://api.kidsgourmet.com.tr/wp-json/wp/v2/posts?per_page=100&_fields=slug&page=N
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = join(__dirname, '../src/lib/legacy-blog-slugs.ts');

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.kidsgourmet.com.tr/wp-json';
const PER_PAGE = 100;
const MAX_RETRIES = 3;
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504, 508]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response;
      }

      const error = new Error(`API hatası: ${response.status} ${response.statusText} (${url})`);
      lastError = error;

      if (!RETRYABLE_STATUSES.has(response.status) || attempt === MAX_RETRIES) {
        throw error;
      }

      const delayMs = 500 * 2 ** (attempt - 1);
      console.warn(`  ⚠️ Geçici API hatası (${response.status}). ${delayMs}ms sonra tekrar deneniyor...`);
      await sleep(delayMs);
    } catch (error) {
      lastError = error;

      if (attempt === MAX_RETRIES) {
        throw error;
      }

      const delayMs = 500 * 2 ** (attempt - 1);
      console.warn(`  ⚠️ API isteği başarısız oldu. ${delayMs}ms sonra tekrar deneniyor...`);
      await sleep(delayMs);
    }
  }

  throw lastError || new Error(`API isteği başarısız oldu (${url})`);
}

async function fetchSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  console.log('WordPress blog yazısı slug\'ları çekiliyor...');

  while (page <= totalPages) {
    const url = `${WP_API_BASE}/wp/v2/posts?per_page=${PER_PAGE}&_fields=slug&page=${page}`;
    console.log(`  Sayfa ${page}/${totalPages}: ${url}`);

    const response = await fetchWithRetry(url);
    const posts = await response.json();
    if (!Array.isArray(posts) || posts.length === 0 || posts.some((p) => typeof p?.slug !== 'string' || !p.slug.trim())) {
      throw new Error(`Geçersiz veya eksik WordPress slug verisi (sayfa ${page}). Snapshot korunuyor.`);
    }

    slugs.push(...posts.map((post) => post.slug));

    const wpTotalPages = response.headers.get('x-wp-totalpages');
    if (wpTotalPages) {
      const parsed = Number.parseInt(wpTotalPages, 10);
      if (!Number.isSafeInteger(parsed) || parsed < page || parsed > 1000) {
        throw new Error(`WordPress sayfalama bilgisi geçersiz: ${wpTotalPages}`);
      }
      totalPages = parsed;
    }

    page++;
  }

  if (slugs.length === 0) throw new Error('Boş WordPress slug listesi reddedildi.');
  return slugs;
}

export function generateFileContent(slugs) {
  if (!Array.isArray(slugs) || slugs.some((slug) => typeof slug !== 'string' || !slug.trim())) {
    throw new Error('Geçersiz WordPress slug listesi.');
  }
  const sortedSlugs = [...new Set(slugs)].sort();
  if (sortedSlugs.length === 0) throw new Error('Boş slug listesi kaydedilemez.');
  const slugLines = sortedSlugs.map((slug) => `  ${JSON.stringify(slug)},`).join('\n');

  return `/**
 * WordPress'ten taşınan blog yazılarının slug listesi.
 *
 * Bu dosya otomatik olarak üretilmiştir.
 * Toplam slug sayısı: ${sortedSlugs.length}
 *
 * Yenilemek için: npm run refresh:legacy-slugs
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

export function saveGeneratedFile(content, outputFile = OUTPUT_FILE) {
  if (existsSync(outputFile) && readFileSync(outputFile, 'utf8') === content) {
    return false;
  }
  writeFileSync(outputFile, content, 'utf8');
  return true;
}

async function main() {
  try {
    const slugs = await fetchSlugs();
    console.log(`\nToplam ${slugs.length} slug bulundu.`);

    const content = generateFileContent(slugs);
    const changed = saveGeneratedFile(content);
    console.log(changed
      ? `\n✅ ${OUTPUT_FILE} güncellendi. SEO snapshot değişikliğini Git'e commit edin.`
      : `\n✅ ${OUTPUT_FILE} zaten güncel; dosyaya dokunulmadı.`);
  } catch (error) {
    console.warn(`\n⚠️ WordPress slug listesi yenilenemedi: ${error.message}`);

    if (existsSync(OUTPUT_FILE)) {
      console.error('⚠️ Mevcut SEO snapshot korundu; güncelleme başarısız.');
      process.exitCode = 1;
      return;
    }

    console.error('Hata: Mevcut fallback slug dosyası da bulunamadı; build güvenli şekilde devam edemez.');
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
