'use client';

/**
 * Header Leaderboard Ad - 728x90
 * Desktop only, centered below header
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

interface HeaderLeaderboardAdProps {
  className?: string;
}

export function HeaderLeaderboardAd({ className = '' }: HeaderLeaderboardAdProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  // Only show on desktop/tablet
  if (deviceType === 'mobile' || !adsEnabled || !initialized) return null;

  const slots = getSlotsByPlacement('header-leaderboard');
  
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
    <div className={`ad-zone ad-zone-header-leaderboard w-full flex justify-center pt-[30px] pb-[10px] bg-gray-50/50 ${className}`}>
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
