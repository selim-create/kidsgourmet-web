'use client';

/**
 * Ad Slot Component - Basic ad slot rendering
 */

import React from 'react';
import { useAdSlot } from '@/hooks/useAdSlot';
import { AdPlaceholder } from './AdPlaceholder';
import { DebugAdSlot } from './DebugAdSlot';
import type { AdSlotProps } from '@/lib/ads/types';

export function AdSlot({ slotId, className = '', style, debug = false }: AdSlotProps) {
  const { slotRef, slotConfig, isDebugMode } = useAdSlot({ slotId });

  // Show debug mode if enabled globally or per-component
  const showDebug = debug || isDebugMode;

  if (!slotConfig) {
    return null;
  }

  if (!slotConfig.enabled) {
    return null;
  }

  if (showDebug) {
    return <DebugAdSlot slotConfig={slotConfig} className={className} />;
  }

  const minHeight = slotConfig.min_height || 250;

  return (
    <div
      className={`ad-slot-wrapper ${className}`}
      style={{ minHeight: `${minHeight}px`, ...style }}
    >
      <div
        id={slotConfig.slot_id}
        ref={slotRef}
        className="ad-slot"
        style={{ minHeight: `${minHeight}px` }}
      >
        {/* Placeholder shown until ad loads */}
        <AdPlaceholder minHeight={minHeight} />
      </div>
    </div>
  );
}
