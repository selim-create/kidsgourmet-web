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
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();
  
  // Calculate actualSlotId (no hooks here, just computation)
  let actualSlotId = slotId || '';
  if (!actualSlotId) {
    const inContentSlots = getSlotsByPlacement('content-middle');
    const compatibleSlots = inContentSlots.filter((slot) => {
      if (Array.isArray(slot.devices)) {
        return slot.devices.includes(detectedDevice);
      }
      return slot.device === detectedDevice || slot.device === 'all';
    });
    if (compatibleSlots.length > 0) {
      actualSlotId = compatibleSlots[0].slot_id || compatibleSlots[0].slotId || '';
    }
  }

  // ALL HOOKS MUST BE CALLED BEFORE ANY RETURN
  const { slotRef, slotConfig, isDebugMode } = useAdSlot({
    slotId: actualSlotId,
    lazyLoad,
    enabled: !!actualSlotId && adsEnabled && initialized,  // Pass enabled flag
  });

  const showDebug = debug || isDebugMode;

  // NOW we can do early returns
  if (!actualSlotId || !slotConfig || !slotConfig.enabled) {
    return null;
  }

  if (showDebug) {
    return (
      <div className={`in-content-ad my-8 ${className}`} style={style}>
        <DebugAdSlot slotConfig={slotConfig} />
      </div>
    );
  }

  const minHeight = slotConfig.min_height || slotConfig.minHeight || 250;

  return (
    <div className={`in-content-ad my-8 ${className}`} style={style}>
      <div className="text-xs text-gray-400 text-center mb-2">{AD_TEXT.SPONSORED_CONTENT}</div>
      <div
        id={slotConfig.slot_id || slotConfig.slotId}
        ref={slotRef}
        className="ad-slot"
        style={{ minHeight: `${minHeight}px` }}
      >
        <AdPlaceholder minHeight={minHeight} />
      </div>
    </div>
  );
}
