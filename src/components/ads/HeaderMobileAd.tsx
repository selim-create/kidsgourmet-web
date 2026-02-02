'use client';

/**
 * Header Mobile Ad - 320x100
 * Mobile only, centered below header
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

interface HeaderMobileAdProps {
  className?: string;
}

export function HeaderMobileAd({ className = '' }: HeaderMobileAdProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  // Only show on mobile
  if (deviceType !== 'mobile' || !adsEnabled || !initialized) return null;

  const slots = getSlotsByPlacement('header-mobile');
  
  const slot = slots.find((slot) => {
    if (Array.isArray(slot.devices)) {
      return slot.devices.includes('mobile') || slot.devices.includes('all');
    }
    return slot.device === 'mobile' || slot.device === 'all';
  });

  if (!slot) return null;

  const slotId = slot.slot_id || slot.slotId || '';

  return (
    <div className={`ad-zone ad-zone-header-mobile w-full flex justify-center pt-4 bg-gray-50/50 ${className}`}>
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
