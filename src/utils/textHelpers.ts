/**
 * Text Helper Utilities
 * For HTML entity decoding and text manipulation
 */

/**
 * SSR-safe version of HTML entity decoder
 * Use this in components that render server-side
 * This is the recommended function to use throughout the application
 */
export function decodeEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  // Decode in specific order to avoid double-escaping issues
  // First decode numeric entities, then named entities
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&'); // Decode &amp; last to avoid double-decoding
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
