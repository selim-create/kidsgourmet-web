'use client';

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

type ContentPlacement = 
  | 'content-top'
  | 'content-after-hero'
  | 'content-in-feed'
  | 'content-after-section'
  | 'content-middle'
  | 'content-bottom'
  | 'in-content'; // legacy

interface ContentAdProps {
  placement: ContentPlacement;
  className?: string;
  fallbackPlacement?: string;
}

export function ContentAd({ placement, className = '', fallbackPlacement = 'in-content' }: ContentAdProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  if (!adsEnabled || !initialized) return null;

  let slots = getSlotsByPlacement(placement);
  
  // Fallback to legacy placement
  if (slots.length === 0 && fallbackPlacement) {
    slots = getSlotsByPlacement(fallbackPlacement as any);
  }

  // Filter by device
  const compatibleSlot = slots.find((slot) => {
    if (Array.isArray(slot.devices)) {
      return slot.devices.includes(deviceType) || slot.devices.includes('all');
    }
    return slot.device === deviceType || slot.device === 'all';
  });

  if (!compatibleSlot) return null;

  const slotId = compatibleSlot.slot_id || compatibleSlot.slotId || '';

  return (
    <div className={`ad-zone ad-zone-content w-full flex justify-center my-6 ${className}`}>
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
