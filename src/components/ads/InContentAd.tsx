'use client';

/**
 * In-Content Ad Component - Ads inserted within content
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { useAdSlot } from '@/hooks/useAdSlot';
import { AdPlaceholder } from './AdPlaceholder';
import { DebugAdSlot } from './DebugAdSlot';
import { AD_TEXT } from '@/lib/ads/constants';

interface InContentAdProps {
  slotId?: string;
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
  const detectedDevice = useDeviceType();
  const { getSlotsByPlacement } = useAds();
  
  // If no slotId provided, find an in-content slot automatically
  let actualSlotId = slotId;
  if (!actualSlotId) {
    const inContentSlots = getSlotsByPlacement('in-content');
    const compatibleSlots = inContentSlots.filter((slot) =>
      slot.devices.includes(detectedDevice)
    );
    if (compatibleSlots.length > 0) {
      actualSlotId = compatibleSlots[0].slot_id;
    } else {
      // No compatible slot found, return null
      return null;
    }
  }
  
  const { slotRef, slotConfig, isDebugMode } = useAdSlot({
    slotId: actualSlotId,
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
      <div className="text-xs text-gray-400 text-center mb-2">{AD_TEXT.SPONSORED_CONTENT}</div>
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
