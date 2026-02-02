'use client';

/**
 * Footer Banner Ad - 728x90
 * Desktop only, centered above footer
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

interface FooterBannerAdProps {
  className?: string;
}

export function FooterBannerAd({ className = '' }: FooterBannerAdProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  // Only show on desktop/tablet
  if (deviceType === 'mobile' || !adsEnabled || !initialized) return null;

  const slots = getSlotsByPlacement('footer-banner');
  
  const compatibleSlot = slots.find((slot) => {
    if (Array.isArray(slot.devices)) {
      return slot.devices.includes(deviceType) || slot.devices.includes('all');
    }
    return slot.device === deviceType || slot.device === 'all';
  });

  if (!compatibleSlot) return null;

  const slotId = compatibleSlot.slot_id || compatibleSlot.slotId || '';

  return (
    <div className={`ad-zone ad-zone-footer-banner w-full flex justify-center py-4 bg-gray-50/50 ${className}`}>
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
