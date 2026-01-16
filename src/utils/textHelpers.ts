/**
 * Text Helper Utilities
 * For HTML entity decoding and text manipulation
 */

/**
 * HTML entities'i decode eder (Server ve Client side uyumlu)
 * Emojiler, &amp;, &#8217;, &#x1F60A; gibi tüm entity'leri çözer
 */
export const decodeEntities = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string') return '';
  
  // Named entities
  const namedEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#039;': "'",
    '&nbsp;': ' ',
    '&ndash;': '\u2013',
    '&mdash;': '\u2014',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&hellip;': '\u2026',
    '&copy;': '\u00A9',
    '&reg;': '\u00AE',
    '&trade;': '\u2122',
    '&euro;': '\u20AC',
    '&pound;': '\u00A3',
    '&yen;': '\u00A5',
    '&cent;': '\u00A2',
    '&deg;': '\u00B0',
    '&plusmn;': '\u00B1',
    '&times;': '\u00D7',
    '&divide;': '\u00F7',
    '&frac12;': '\u00BD',
    '&frac14;': '\u00BC',
    '&frac34;': '\u00BE',
  };
  
  let result = text;
  
  // Named entities'i replace et
  for (const [entity, char] of Object.entries(namedEntities)) {
    result = result.replace(new RegExp(entity, 'gi'), char);
  }
  
  // Decimal numeric entities: &#8217; &#60; etc.
  result = result.replace(/&#(\d+);/g, (_, code) => {
    const num = parseInt(code, 10);
    try {
      return String.fromCodePoint(num);
    } catch {
      return '';
    }
  });
  
  // Hexadecimal numeric entities: &#x1F60A; &#x27; etc.
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    const num = parseInt(hex, 16);
    try {
      return String.fromCodePoint(num);
    } catch {
      return '';
    }
  });
  
  return result;
};

/**
 * HTML tag'lerini temizler ve entities'i decode eder
 */
export const stripHtmlAndDecode = (html: string | undefined | null): string => {
  if (!html || typeof html !== 'string') return '';
  
  // HTML tag'lerini kaldır
  const stripped = html.replace(/<[^>]*>/g, '');
  
  // Entities'i decode et
  return decodeEntities(stripped);
};

/**
 * WordPress rendered content'ten text çıkarır
 */
export const getPlainText = (rendered: { rendered?: string } | string | undefined | null): string => {
  if (!rendered) return '';
  
  const html = typeof rendered === 'string' ? rendered : rendered.rendered || '';
  return stripHtmlAndDecode(html);
};

/**
 * Convert text to URL-friendly slug
 * Used for generating anchor IDs from headings
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}
