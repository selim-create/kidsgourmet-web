/**
 * Text Helper Utilities
 * For HTML entity decoding and text manipulation
 */

/**
 * Decode HTML entities like &amp; to &
 * Client-side version using textarea element
 * NOT SSR-safe - use decodeEntities for SSR
 */
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  let decoded = textarea.value;
  
  // Manual replacements for common entities
  decoded = decoded
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#039;/g, "'");
  
  return decoded;
}

/**
 * SSR-safe version of HTML entity decoder
 * Use this in components that render server-side
 */
export function decodeEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
