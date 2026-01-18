'use client';

import React from 'react';
import { EmbedData } from '@/services/blog-service';
import EmbedContainer from './EmbedContainer';

interface ContentWithEmbedsProps {
  htmlContent: string;
  embeddedContent?: EmbedData[];
}

export default function ContentWithEmbeds({ htmlContent, embeddedContent }: ContentWithEmbedsProps) {
  // If no embeds, just render the HTML content
  if (!embeddedContent || embeddedContent.length === 0) {
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  }

  // Split content by closing paragraph tags
  // Note: This is a simplified approach that works for standard WordPress content.
  // It assumes well-formed HTML with standard </p> tags.
  // For more complex HTML structures (self-closing tags, nested elements),
  // consider using a proper HTML parser library.
  const splitContent = (content: string): string[] => {
    const parts: string[] = [];
    const regex = /<\/p>/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Include the closing </p> tag in the part
      parts.push(content.substring(lastIndex, match.index + 4));
      lastIndex = match.index + 4;
    }

    // Add any remaining content
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  // Sort embeds by position
  const sortedEmbeds = [...embeddedContent].sort((a, b) => a.position - b.position);

  // Split the HTML content into paragraph chunks
  const contentParts = splitContent(htmlContent);

  // Build the final content with embeds injected at the right positions
  const renderContent = () => {
    const elements: React.ReactNode[] = [];
    let embedIndex = 0;

    contentParts.forEach((part, index) => {
      // Add the HTML content part
      elements.push(
        <div 
          key={`content-${index}`} 
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );

      // Check if we need to inject an embed after this paragraph
      while (embedIndex < sortedEmbeds.length && sortedEmbeds[embedIndex].position === index + 1) {
        elements.push(
          <EmbedContainer 
            key={`embed-${sortedEmbeds[embedIndex].placeholder_id}`}
            embedData={sortedEmbeds[embedIndex]}
          />
        );
        embedIndex++;
      }
    });

    // Add any remaining embeds that are positioned beyond the content
    while (embedIndex < sortedEmbeds.length) {
      elements.push(
        <EmbedContainer 
          key={`embed-${sortedEmbeds[embedIndex].placeholder_id}`}
          embedData={sortedEmbeds[embedIndex]}
        />
      );
      embedIndex++;
    }

    return elements;
  };

  return <>{renderContent()}</>;
}
