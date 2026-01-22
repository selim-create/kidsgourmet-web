'use client';

/**
 * In-Content Ad Component - Ads inserted within content
 */

import React from 'react';
import { useAdSlot } from '@/hooks/useAdSlot';
import { AdPlaceholder } from './AdPlaceholder';
import { DebugAdSlot } from './DebugAdSlot';

interface InContentAdProps {
  slotId: string;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
  lazyLoad?: boolean;
}

export function InContentAd({
  slotId,
  className = '',
  style,
  debug = false,
  lazyLoad = true,
}: InContentAdProps) {
  const { slotRef, slotConfig, isDebugMode } = useAdSlot({
    slotId,
    lazyLoad,
  });

  const showDebug = debug || isDebugMode;

  if (!slotConfig || !slotConfig.enabled) {
    return null;
  }

  if (showDebug) {
    return (
      <div className={`in-content-ad my-8 ${className}`} style={style}>
        <DebugAdSlot slotConfig={slotConfig} />
      </div>
    );
  }

  const minHeight = slotConfig.min_height || 250;

  return (
    <div className={`in-content-ad my-8 ${className}`} style={style}>
      <div className="text-xs text-gray-400 text-center mb-2">Sponsorlu İçerik</div>
      <div
        id={slotConfig.slot_id}
        ref={slotRef}
        className="ad-slot"
        style={{ minHeight: `${minHeight}px` }}
      >
        <AdPlaceholder minHeight={minHeight} />
      </div>
    </div>
  );
}
