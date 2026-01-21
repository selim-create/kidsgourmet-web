"use client";

import DOMPurify from 'isomorphic-dompurify';
import { decodeHtmlEntities } from '@/utils/helpers';

interface RichContentProps {
  html: string;
  className?: string;
}

/**
 * RichContent component
 * Safely renders HTML content with emoji decoding and XSS protection
 * Note: Allows semantic text formatting only, not structural HTML elements
 */
export default function RichContent({ html, className = '' }: RichContentProps) {
  // Decode HTML entities (including emojis)
  const decodedHtml = decodeHtmlEntities(html);
  
  // Sanitize HTML to prevent XSS - only allow semantic text formatting tags
  const cleanHtml = DOMPurify.sanitize(decodedHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  return (
    <div 
      className={`prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
