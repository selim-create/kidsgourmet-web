'use client';

/**
 * Sticky Ad Component - For sticky/fixed position ads
 */

import React from 'react';
import { AdSlot } from './AdSlot';
import type { AdSlotProps } from '@/lib/ads/types';

interface StickyAdProps extends AdSlotProps {
  position?: 'top' | 'bottom';
  offset?: number;
}

export function StickyAd({
  slotId,
  position = 'bottom',
  offset = 0,
  className = '',
  style,
  debug,
}: StickyAdProps) {
  const positionStyles: React.CSSProperties = {
    position: 'sticky',
    [position]: `${offset}px`,
    zIndex: 40,
    ...style,
  };

  return (
    <div className={`sticky-ad ${className}`} style={positionStyles}>
      <AdSlot slotId={slotId} debug={debug} />
    </div>
  );
}
