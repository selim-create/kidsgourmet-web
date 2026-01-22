'use client';

/**
 * Ad Placeholder Component - Prevents CLS (Cumulative Layout Shift)
 */

import React from 'react';
import { AD_TEXT } from '@/lib/ads/constants';

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
      <div className="text-gray-400 text-sm">{AD_TEXT.PLACEHOLDER}</div>
    </div>
  );
}
