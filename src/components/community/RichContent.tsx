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
 */
export default function RichContent({ html, className = '' }: RichContentProps) {
  // Decode HTML entities (including emojis)
  const decodedHtml = decodeHtmlEntities(html);
  
  // Sanitize HTML to prevent XSS
  const cleanHtml = DOMPurify.sanitize(decodedHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  return (
    <div 
      className={`prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
