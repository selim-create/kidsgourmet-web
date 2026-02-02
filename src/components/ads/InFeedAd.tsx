'use client';

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

interface InFeedAdProps {
  className?: string;
}

export function InFeedAd({ className = '' }: InFeedAdProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  if (!adsEnabled || !initialized) return null;

  // content-in-feed or MediumRectangle placement
  let slots = getSlotsByPlacement('content-in-feed');
  if (slots.length === 0) {
    slots = getSlotsByPlacement('in-content');
  }

  // Filter for 300x250 size and device compatibility
  const compatibleSlot = slots.find((slot) => {
    const deviceMatch = Array.isArray(slot.devices)
      ? slot.devices.includes(deviceType) || slot.devices.includes('all')
      : slot.device === deviceType || slot.device === 'all';
    
    // Prefer 300x250 for in-feed
    const hasCorrectSize = slot.sizes?.some(
      (s: any) => (s.width === 300 && s.height === 250) || (Array.isArray(s) && s[0] === 300 && s[1] === 250)
    );
    
    return deviceMatch && hasCorrectSize;
  });

  if (!compatibleSlot) return null;

  const slotId = compatibleSlot.slot_id || compatibleSlot.slotId || '';

  return (
    <div className={`ad-zone ad-zone-in-feed w-full flex justify-center items-center p-4 bg-gray-50 rounded-lg ${className}`}>
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
