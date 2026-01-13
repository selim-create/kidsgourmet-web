'use client';

import { useEffect } from 'react';

interface ClientHeadProps {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  ogImage?: string;
  url?: string;
}

/**
 * Client-side head tag manager for SEO
 * Use this in client components to set meta tags dynamically
 */
export default function ClientHead({ title, description, keywords, ogImage, url }: ClientHeadProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      // Safely escape the name value to prevent selector injection
      const escapedName = name.replace(/"/g, '\\"');
      let element = document.querySelector(`meta[${attribute}="${escapedName}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Set meta description
    if (description) {
      setMetaTag('description', description);
      setMetaTag('og:description', description, true);
      setMetaTag('twitter:description', description);
    }

    // Set keywords - handle both string and array types
    if (keywords) {
      let keywordsString: string;
      if (Array.isArray(keywords)) {
        keywordsString = keywords.join(', ');
      } else if (typeof keywords === 'string') {
        keywordsString = keywords;
      } else {
        keywordsString = '';
      }
      if (keywordsString) {
        setMetaTag('keywords', keywordsString);
      }
    }

    // Set Open Graph tags
    if (title) {
      setMetaTag('og:title', title, true);
      setMetaTag('twitter:title', title);
    }

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('twitter:image', ogImage);
    }

    if (url) {
      setMetaTag('og:url', url, true);
    }

    // Set Twitter card type
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('og:type', 'website', true);
  }, [title, description, keywords, ogImage, url]);

  return null;
}
