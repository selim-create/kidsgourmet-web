/**
 * Text Helper Utilities
 * For HTML entity decoding and text manipulation
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * SSR-safe version of HTML entity decoder
 * Use this in components that render server-side
 * This is the recommended function to use throughout the application
 */
export function decodeEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  // First pass: decode HTML entities using a map
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#8211;': '\u2013',
    '&#8212;': '\u2014',
    '&#8216;': '\u2018',
    '&#8217;': '\u2019',
    '&#8220;': '\u201C',
    '&#8221;': '\u201D',
  };
  
  let decoded = text;
  
  // Replace HTML entities (run twice for double-encoded)
  for (let i = 0; i < 2; i++) {
    for (const [entity, char] of Object.entries(htmlEntities)) {
      decoded = decoded.replace(new RegExp(entity, 'gi'), char);
    }
  }
  
  // Use DOMPurify for any remaining entities
  decoded = DOMPurify.sanitize(decoded, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
  
  return decoded;
}

/**
 * Client-side HTML entity decoder using DOMParser (safer than innerHTML)
 * NOT SSR-safe - use decodeEntities for SSR
 * @deprecated Use decodeEntities instead for consistency
 */
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  // Use DOMParser instead of innerHTML for safety
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.documentElement.textContent || '';
  }
  
  // Fallback to manual replacement
  return decodeEntities(text);
}
