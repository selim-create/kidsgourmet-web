'use client';

/**
 * Ad Placeholder Component - Prevents CLS (Cumulative Layout Shift)
 */

import React from 'react';

interface AdPlaceholderProps {
  minHeight?: number;
  className?: string;
}

export function AdPlaceholder({ minHeight = 250, className = '' }: AdPlaceholderProps) {
  return (
    <div
      className={`ad-placeholder bg-gray-100 flex items-center justify-center ${className}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="text-gray-400 text-sm">Reklam Alanı</div>
    </div>
  );
}
