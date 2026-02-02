'use client';

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

interface HeaderAdProps {
  className?: string;
}

export function HeaderAd({ className = '' }: HeaderAdProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  if (!adsEnabled || !initialized) return null;

  // Desktop: header-leaderboard (728x90)
  // Mobile: header-mobile (320x100)
  const placement = deviceType === 'mobile' ? 'header-mobile' : 'header-leaderboard';
  
  let slots = getSlotsByPlacement(placement);

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
    <div className={`ad-zone ad-zone-header w-full flex justify-center py-2 bg-gray-50 ${className}`}>
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
