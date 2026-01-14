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
  
  // Use DOMPurify to safely decode HTML entities
  // This prevents double-escaping and XSS issues
  const decoded = DOMPurify.sanitize(text, { 
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
